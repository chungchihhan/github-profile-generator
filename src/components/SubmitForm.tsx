import { useState } from "react";
import Tag from "@/components/Tag";

interface FormProps {
  onSubmit: (url: string, style: string, tags: string[]) => void;
}

const styles = ["Realistic", "Cartoon", "Abstract", "Minimalist"];
const availableTags = [
  "Nature",
  "Urban",
  "People",
  "Technology",
  "Food",
  "Animals",
];

export default function SubmitForm({ onSubmit }: FormProps) {
  const [url, setUrl] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, style, selectedTags);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div>
        <label
          htmlFor="style"
          className="block text-sm font-medium text-gray-700"
        >
          Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Tag
              key={tag}
              name={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Generate Image
      </button>
    </form>
  );
}
