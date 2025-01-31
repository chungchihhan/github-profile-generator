import { useState } from "react";
import Tag from "@/components/Tag";
import { Github } from "lucide-react";
import CustomDropdown from "@/components/CustomDropdown";
import { FastForward } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex justify-between px-4">
      <div className="flex items-start gap-x-4">
        {/* GitHub Username Input */}
        <div className="">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-bold text-white py-2"
            >
              GitHub Username
            </label>
            <div className="relative flex items-center">
              <Github className="absolute left-3 text-white" size={18} />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/10 pl-10 pr-4 py-2 block w-48 rounded-md shadow-sm focus:outline-none focus:bg-white/15 focus:ring-0 placeholder-white/30 text-white"
                placeholder="chungchihhan"
              />
            </div>
          </div>
        </div>

        {/* Style Dropdown */}
        <div className="">
          <label
            htmlFor="style"
            className="block text-sm font-bold text-white py-2"
          >
            Style
          </label>
          <CustomDropdown
            options={styles}
            selected={style}
            onChange={setStyle}
          />
        </div>

        {/* Size Dropdown */}
        <div>
          <label
            htmlFor="size"
            className="block text-sm font-bold text-white py-2"
          >
            Size
          </label>
          <CustomDropdown options={sizes} selected={size} onChange={setSize} />
        </div>

        {/* Tags Section */}
        <div className="">
          <label
            htmlFor="tags"
            className="block text-sm font-bold text-white py-2"
          >
            Tags
          </label>
          <div className="flex gap-2 py-2">
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
      </div>

      {/* Submit Button */}
      <div className="flex items-center">
        <button
          type="submit"
          className="flex justify-center items-center gap-2 rounded-full bg-transparent text-white p-4 hover:bg-white/10 focus:outline-none focus:bg-white/30"
        >
          Generate
          <FastForward size={18} color="white" />
        </button>
      </div>
    </form>
  );
}
