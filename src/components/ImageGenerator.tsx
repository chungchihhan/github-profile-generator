"use client";

import { useState } from "react";
import SubmitForm from "@/components/SubmitForm";
import { submitForm } from "@/lib/actions";

export default function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (
    username: string,
    style: string,
    size: string,
    tags: string[]
  ) => {
    const repsonse = await submitForm(
      JSON.stringify({ username, style, size, tags })
    );
    console.log(repsonse);
    if (repsonse.status === "error") {
      alert(repsonse.message);
      return;
    } else {
      if (repsonse.imageUrl) {
        setImageUrl(repsonse.imageUrl);
      } else {
        setImageUrl(null);
      }
    }
  };

  return (
    <div className="">
      <div className="px-4">
        <SubmitForm onSubmit={handleSubmit} />
      </div>
      {imageUrl && (
        <div className="">
          <img src={imageUrl} alt="Generated image" className="" />
        </div>
      )}
    </div>
  );
}
