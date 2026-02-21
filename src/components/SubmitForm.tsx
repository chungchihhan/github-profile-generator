import { FastForward } from "lucide-react";

interface FormProps {
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function SubmitForm({ onSubmit, isLoading }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center w-full">
      <button
        type="submit"
        disabled={isLoading}
        className="flex justify-center items-center gap-3 rounded-md bg-white/10 text-white px-8 py-4 hover:bg-white/20 focus:outline-none focus:bg-white/30 transition-colors text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="animate-pulse">Generating Profile...</span>
          </>
        ) : (
          <>
            Generate My GitHub Profile Image
            <FastForward size={20} color="white" />
          </>
        )}
      </button>
    </form>
  );
}