import React, { useState, useEffect, useRef } from "react";
import { getFavs } from "../utils/Favorites";

export const simplifyUrl = (url) => {
  let res = String(url)
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .split("/")[0];

  return res;
};

function SuggestionEntity({ name, url, index, isFocused }) {
  const sidemargin = Math.min((index - isFocused + 2) * 10, 100);

  return (
    <a
      href={url}
      rel="noopener noreferrer"
      className={`rounded-full h-[46px] flex transition-all justify-between gap-8 items-center px-7 backdrop-blur-sm  my-2 ${
        isFocused ? "bg-white/10" : "bg-white/5"
      }`}
      style={{ marginLeft: sidemargin, marginRight: sidemargin }}
    >
      <div className="truncate max-w-2/5">{name}</div>
      <div className="">{simplifyUrl(url)}</div>
    </a>
  );
}

export default function SuggestionBox({ searchText }) {
  const [focusedIndex, setFocusedIndex] = useState(0); // -1 = none focused
  const containerRef = useRef(null);

  const filteredWebsites = getFavs()
    .filter((site) =>
      site.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .slice(0, 5);

  const allSuggestions = [
    ...filteredWebsites,
    {
      name: `Google "${searchText}"`,
      url: `https://www.google.com/search?q=${encodeURIComponent(searchText)}`,
    },
    {
      name: `ChatGPT "${searchText}"`,
      url: `https://www.chatgpt.com/?prompt=${encodeURIComponent(searchText)}`,
    },
  ];

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (!allSuggestions.length) return;

      if (e.key === "Tab" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % allSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev <= 0 ? allSuggestions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        window.location.href = allSuggestions[focusedIndex].url;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allSuggestions, focusedIndex]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [searchText]);

  if (!searchText) return null;

  return (
    <div ref={containerRef} className="absolute w-full overflow-y-auto">
      {allSuggestions.map((site, idx) => (
        <SuggestionEntity
          key={site.url}
          name={site.name}
          url={site.url}
          index={idx}
          isFocused={focusedIndex === idx}
        />
      ))}
    </div>
  );
}
