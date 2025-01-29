"use server";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  style: z.string().min(1, "Style is required"),
  tags: z.array(z.string()),
});

export async function submitForm(data: string) {
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

    // Extract username from validated data
    const { username, style, tags } = validation.data;

    // Fetch GitHub repos
    const githubUrl = new URL(`https://api.github.com/users/${username}/repos`);
    const githubResponse = await fetch(githubUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!githubResponse.ok) {
      throw new Error("Failed to fetch GitHub repositories.");
    }

    const repoData = await githubResponse.json();
    const repoDetails = repoData.map(
      (repo: {
        name: string;
        description: string | null;
        language: string | null;
      }) => {
        return `${repo.name} - ${repo.description || "No description"} - ${
          repo.language || "No language specified"
        }`;
      }
    );

    // Generate Image using OpenAI DALL·E
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      throw new Error("Missing OpenAI API Key");
    }

    const prompt = `
    Generate an image representing GitHub user "${username}" in a "${style}" style. 
    Highlight themes: ${tags.join(", ")}.
    Capture the essence of their repositories:
    ${repoDetails.join("\n")}
    `;

    console.log("Prompt:", prompt);

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024",
        }),
      }
    );

    const openaiResult = await openaiResponse.json();
    if (!openaiResult.data || openaiResult.data.length === 0) {
      throw new Error("No images generated by OpenAI.");
    }

    const imageUrl = openaiResult.data[0].url;

    return {
      status: "success",
      message: "Form submitted successfully",
      repos: repoDetails,
      imageUrl,
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Error: Failed to process request.",
      error: error.message,
    };
  }
}
