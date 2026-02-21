"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SubmitForm from "@/components/SubmitForm";
import { submitForm } from "@/lib/actions";

interface GenerationResult {
  status: string;
  message: string;
  username?: string;
  analysis?: string;
  imagePrompt?: string;
  repoCount?: number;
  imageUrl?: string | null;
  needsImageGeneration?: boolean;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export default function ImageGenerator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status !== "loading") {
      setCheckingAuth(false);
    }
  }, [status, router]);

  const handleSubmit = async () => {
    if (!session?.user?.name || !session?.accessToken) {
      alert("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await submitForm(
        JSON.stringify({
          username: session.user.name,
          accessToken: session.accessToken
        })
      );
      console.log(response);

      if (response.status === "error") {
        alert(response.message);
      } else {
        setResult(response as GenerationResult);
      }
    } catch (error) {
      console.error("Error generating profile:", error);
      alert("An error occurred while generating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-white font-mono">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-white">Your session has expired. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Generate Your GitHub Profile Image
        </h1>
        <p className="text-white/70">
          Welcome, {session.user?.name}! Let's create a unique profile image based on your repositories.
        </p>
      </div>

      <div className="px-4">
        <SubmitForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {isLoading && (
        <div className="px-4 text-white">
          <div className="bg-white/10 rounded-lg p-6">
            <p className="text-lg animate-pulse">Analyzing your GitHub repositories...</p>
            <p className="text-sm opacity-75 mt-2">This may take a few moments...</p>
          </div>
        </div>
      )}

      {result && result.status === "success" && (
        <div className="px-4 space-y-6 text-white">
          {/* Profile Summary */}
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">
              Profile Analysis Complete
            </h2>
            <p className="text-sm opacity-75">
              Analyzed {result.repoCount} repositories for {result.username}
            </p>
          </div>

          {/* Analysis Section */}
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Developer Analysis</h3>
            <div className="whitespace-pre-wrap text-sm opacity-90">
              {result.analysis}
            </div>
          </div>

          {/* Generated Prompt Section */}
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Generated Image Prompt</h3>
            <div className="whitespace-pre-wrap text-sm opacity-90 italic">
              {result.imagePrompt}
            </div>
          </div>

          {/* Image Section */}
          {result.imageUrl ? (
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Generated Image</h3>
              <img
                src={result.imageUrl}
                alt="Generated GitHub profile"
                className="w-full rounded-lg"
              />
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Image Generation</h3>
              <p className="text-sm opacity-75">
                Image generation is ready! The prompt above can be used with image generation services
                like Stable Diffusion, DALL-E, or Midjourney to create your unique GitHub profile banner.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}