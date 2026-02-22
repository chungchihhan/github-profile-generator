"use client";

import { useEffect, useState } from "react";

interface StreamingTextProps {
  text: string;
  speed?: number; // milliseconds between characters
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

export default function StreamingText({
  text,
  speed = 10,
  onComplete,
  className = "",
  showCursor = true,
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="animate-pulse">▊</span>
      )}
    </div>
  );
}