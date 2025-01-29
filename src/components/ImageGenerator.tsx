"use client";

import { useState } from "react";
import SubmitForm from "@/components/SubmitForm";
import { submitForm } from "@/lib/actions";

export default function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (
    username: string,
    style: string,
    tags: string[]
  ) => {
    const repsonse = await submitForm(
      JSON.stringify({ username, style, tags })
    );
    console.log(repsonse);
    if (repsonse.status === "error") {
      alert(repsonse.message);
      return;
    } else {
      setImageUrl(repsonse.imageUrl);
    }
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
            src={imageUrl}
            alt="Generated image"
            className="mx-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
