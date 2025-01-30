import { useState } from "react";
import Tag from "@/components/Tag";
import { Github } from "lucide-react";
import CustomDropdown from "@/components/CustomDropdown";

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
    <form onSubmit={handleSubmit} className="bg-white rounded p-8 space-y-8">
      <div>
        <label
          htmlFor="username"
          className="block text-md font-bold text-neutral-700 py-2"
        >
          GitHub Username
        </label>
        <div className="relative">
          <Github
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="pl-10 pr-4 py-2 block w-full rounded-md border-2 border-neutral-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="chungchihhan"
          />
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <div className="w-full">
          <label
            htmlFor="style"
            className="block text-md font-bold text-neutral-700 py-2"
          >
            Style
          </label>
          <CustomDropdown
            options={styles}
            selected={style}
            onChange={setStyle}
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="size"
            className="block text-md font-bold text-neutral-700 py-2"
          >
            Size
          </label>
          <CustomDropdown options={sizes} selected={size} onChange={setSize} />
        </div>
      </div>
      <div>
        <span className="block text-md font-bold text-neutral-700 py-2">
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
