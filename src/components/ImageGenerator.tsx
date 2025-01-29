"use client";

import { useState } from "react";
import SubmitForm from "@/components/SubmitForm";

export default function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [repos, setRepos] = useState<string[]>([]);

  const fetchRepos = async (username: string) => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is an array before mapping
      if (Array.isArray(data)) {
        const repoDetails = data.map(
          (repo: {
            name: string;
            description: string | null;
            language: string | null;
          }) => {
            // Fallback to "No description" if description is null
            const description = repo.description
              ? repo.description
              : "No description";

            const language = repo.language
              ? repo.language
              : "No language specified";

            return `${repo.name} - ${description} - ${language}`;
          }
        );

        setRepos(repoDetails);
        console.log("Repositories:", repoDetails);
      } else {
        console.error("Unexpected API response format", data);
        setRepos([]);
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
      setRepos([]);
    }
  };

  const handleSubmit = (username: string, style: string, tags: string[]) => {
    // Here you would typically make an API call to generate the image
    // For this example, we'll just set a placeholder image
    fetchRepos(username);

    setImageUrl(`https://picsum.photos/800/600?random=${Math.random()}`);
  };

  return (
    <div
      className={`container mx-auto px-4 ${
        imageUrl ? "mt-8" : "flex h-screen items-center justify-center"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-md p-6 ${
          imageUrl ? "mb-8" : ""
        }`}
      >
        <SubmitForm onSubmit={handleSubmit} />
      </div>
      {imageUrl && (
        <div className="mt-8">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Generated image"
            className="mx-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
