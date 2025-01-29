"use client";

import { useState } from "react";
import SubmitForm from "@/components/SubmitForm";

export default function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = (url: string, style: string, tags: string[]) => {
    // Here you would typically make an API call to generate the image
    // For this example, we'll just set a placeholder image
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
