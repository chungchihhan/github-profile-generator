"use client";
import { useState, useRef, useEffect } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative w-full z-50 overflow-visible" ref={dropdownRef}>
      {/* Dropdown Button */}
      <div
        className="flex items-center gap-2 rounded-md p-2 cursor-pointer shadow-sm bg-white/10 text-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ChevronDown className="text-white w-5 h-5" />
        <span className="flex-1 text-white mr-2">{selected}</span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white/10 rounded-md shadow-md z-[9999]">
          {options.map((option) => (
            <div
              key={option}
              className={`p-2 cursor-pointer hover:bg-white/15 hover:rounded-md text-white ${
                selected === option ? "bg-white/10 rounded-md" : ""
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
