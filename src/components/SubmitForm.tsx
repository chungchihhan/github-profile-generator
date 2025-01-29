import { useState } from "react";
import Tag from "@/components/Tag";

interface FormProps {
  onSubmit: (url: string, style: string, size: string, tags: string[]) => void;
}

const styles = [
  "Pixel Art",
  "Cartoon",
  "3D",
  "Cyberpunk",
  "Manga",
  "Street Art",
];

const sizes = ["1024x1024", "1792x1024", "1024x1792"];

const availableTags = [
  "Cats",
  "Dogs",
  "Animals",
  "Bedroom",
  "Office",
  "People",
  "Technology",
  "Nature",
  "Urban",
  "Food",
];

export default function SubmitForm({ onSubmit }: FormProps) {
  const [username, setUsername] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [size, setSize] = useState(sizes[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, style, size, selectedTags);
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
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          github username
        </label>
        <input
          type="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="chungchihhan"
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
          {styles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="size"
          className="block text-sm font-medium text-gray-700"
        >
          Size
        </label>
        <select
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
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
