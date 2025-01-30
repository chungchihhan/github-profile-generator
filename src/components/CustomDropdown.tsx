"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CustomDropdownProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function CustomDropdown({
  options,
  selected,
  onChange,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <div
        className="flex items-center gap-2 border-2 border-neutral-300 rounded-md p-2 cursor-pointer shadow-sm bg-white focus-within:border-indigo-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Custom Left Icon */}
        <ChevronDown className="text-neutral-500 w-5 h-5" />

        {/* Selected Value */}
        <span className="flex-1 text-gray-800">{selected}</span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-neutral-300 rounded-md shadow-md overflow-hidden">
          {options.map((option) => (
            <div
              key={option}
              className={`p-2 cursor-pointer hover:bg-indigo-100 text-gray-800 ${
                selected === option ? "bg-indigo-200" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
