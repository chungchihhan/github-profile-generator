"use server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  accessToken: z.string().min(1, "Access token is required"),
});

export async function submitForm(data: string) {
  console.log("Received data:", data);
  const parsedData = JSON.parse(data);
  const validation = formSchema.safeParse(parsedData);

  if (!validation.success) {
    return {
      status: "error",
      message: "Validation failed",
      errors: validation.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    };
  }

  try {
    console.log("Validated data:", validation.data);
    const { username, accessToken } = validation.data;

    // Fetch user's repos using their access token for higher rate limits and private repos access
    const githubResponse = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!githubResponse.ok) {
      throw new Error("Failed to fetch GitHub repositories.");
    }

    const repoData = await githubResponse.json();

    // Filter out forked repos to focus on original work
    const originalRepos = repoData.filter((repo: any) => !repo.fork);

    // Sort repos by importance: combination of stars, recent updates, and size
    const sortedRepos = originalRepos.sort((a: any, b: any) => {
      // Calculate a score for each repo
      const scoreA =
        a.stargazers_count * 3 + // Stars are important
        (a.size || 0) * 0.001 + // Repo size matters a bit
        (new Date(a.updated_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 ? 10 : 0) + // Recently updated
        (a.watchers_count || 0) * 2; // Watchers indicate interest

      const scoreB =
        b.stargazers_count * 3 +
        (b.size || 0) * 0.001 +
        (new Date(b.updated_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 ? 10 : 0) +
        (b.watchers_count || 0) * 2;

      return scoreB - scoreA; // Sort descending
    });

    // Prepare repository information for analysis
    const repoSummary = sortedRepos
      .slice(0, 30) // Analyze up to 30 most important repos
      .map(
        (repo: {
          name: string;
          description: string | null;
          language: string | null;
          stargazers_count: number;
          forks_count: number;
          topics?: string[];
          created_at: string;
          updated_at: string;
        }) => {
          const topics =
            repo.topics && repo.topics.length > 0
              ? `, Topics: ${repo.topics.slice(0, 3).join(", ")}`
              : "";
          return `- ${repo.name}: ${repo.description || "No description"} (${
            repo.language || "Multiple languages"
          }, ${repo.stargazers_count} stars${topics})`;
        },
      )
      .join("\n");

    // Initialize Gemini AI
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("Missing Gemini API Key");
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // Step 1: Analyze repositories and create a comprehensive profile
    const analysisModel = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const analysisPrompt = `
    Analyze the following GitHub repositories for user "${username}" and create a comprehensive developer profile.
    Focus on original work (forks have been filtered out).

    Repositories:
    ${repoSummary}

    Please provide a structured analysis:
    1. **Primary Technologies**: Main programming languages and frameworks
    2. **Developer Type**: (e.g., full-stack, frontend, backend, DevOps, data scientist)
    3. **Domain Expertise**: Key areas of focus and specialization
    4. **Notable Projects**: Most significant or interesting repositories
    5. **Development Style**: Patterns in their work (open source contributor, tool builder, etc.)
    6. **Visual Concept**: A creative visual metaphor that represents this developer's journey

    Be insightful and specific. Focus on what makes this developer unique.
    `;

    const analysisResult = await analysisModel.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text();
    console.log("Repository Analysis:", analysisText);

    // Step 2: Generate an optimized image prompt based on the analysis
    const promptModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const promptGenerationPrompt = `
    Based on this developer profile analysis:
    ${analysisText}

    Create a detailed, visually striking image generation prompt that captures the essence of ${username}'s GitHub profile.

    Requirements:
    - Make it artistic and modern, suitable for a GitHub README banner
    - Include abstract representations of their tech stack
    - Incorporate visual metaphors for their coding style and expertise
    - Use a color palette that reflects their primary technologies
    - Dimensions should work well as a banner (wide aspect ratio)
    - Style should be professional yet creative

    Output only the complete image generation prompt, nothing else. Make it detailed and specific.
    `;

    const promptResult = await promptModel.generateContent(
      promptGenerationPrompt,
    );
    const imagePrompt = promptResult.response.text();
    console.log("Generated Image Prompt:", imagePrompt);

    // Step 3: Generate image using Gemini 2.5 Flash Image model
    let imageUrl = null;
    let imageBase64 = null;

    try {
      const imageModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-image",
      });

      // Generate the image based on the prompt
      const imageGenerationPrompt = `Create a picture of ${imagePrompt}`;

      const imageResult = await imageModel.generateContent(
        imageGenerationPrompt,
      );

      // Check if the response contains image data
      const response = imageResult.response;
      if (response.candidates && response.candidates[0]) {
        const parts = response.candidates[0].content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
              // Image was generated successfully
              imageBase64 = part.inlineData.data;
              // Convert base64 to data URL for display
              imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${imageBase64}`;
              console.log("Image generated successfully");
              break;
            }
          }
        }
      }
    } catch (imageError) {
      console.log("Image generation not available or failed:", imageError);
      // Continue without image - prompt is still valuable
    }

    // Get repo names for display
    const repoNames = sortedRepos
      .slice(0, 30)
      .map((repo: any) => repo.name);

    return {
      status: "success",
      message: "Profile analyzed successfully",
      username: username,
      repos: repoNames,
      analysis: analysisText,
      imagePrompt: imagePrompt,
      repoCount: originalRepos.length,
      totalRepos: repoData.length,
      imageUrl: imageUrl,
      imageBase64: imageBase64,
      needsImageGeneration: !imageUrl, // Only true if image generation failed
    };
  } catch (error) {
    console.error("Error in submitForm:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to process request",
      error: error,
    };
  }
}
