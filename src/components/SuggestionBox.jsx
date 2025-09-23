import React, { useState, useEffect, useRef } from "react";
import { getFavs } from "../utils/Favorites";
import { getAllBookmarks } from "../utils/bookmark";

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

  const [favs, setFavs] = useState(getFavs());

  useEffect(() => {
    getAllBookmarks().then((bms) => {
      const bookmarks = bms.map((bm) => ({ name: bm.title, url: bm.url }));
      setFavs((v) => [...v, ...bookmarks]);
    });
  }, []);

  const filteredWebsites = favs
    .filter(
      (site) =>
        site.name.toLowerCase().includes(searchText.toLowerCase()) ||
        site.url.toLowerCase().includes(searchText.toLowerCase())
    )
    .slice(0, 5);

  const allSuggestions = [
    ...filteredWebsites,
    {
      name: `Google "${searchText}"`,
      url: getGoToUrl(searchText),
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
        if (searchText) window.location.href = allSuggestions[focusedIndex].url;
        // else if (localStorage.getItem("defaultSearch")) {
        //   window.location.href = getGoToUrl(
        //     localStorage.getItem("defaultSearch")
        //   );
        // }
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
          key={site.url + idx}
          name={site.name}
          url={site.url}
          index={idx}
          isFocused={focusedIndex === idx}
        />
      ))}
    </div>
  );
}

function getGoToUrl(text) {
  const trimmed = text.trim();

  // More precise IP validation (0-255 per octet)
  const ipPattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d+)?$/;

  // Localhost pattern
  const localhostPattern = /^localhost(:\d+)?$/i;

  // More precise URL pattern
  const urlPattern =
    /^((https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,})(\/.*)?$/i;

  // Already has protocol
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Localhost or IP - use http by default
  if (localhostPattern.test(trimmed) || ipPattern.test(trimmed)) {
    return `http://${trimmed}`;
  }

  // Valid domain - use https
  if (urlPattern.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Default to search
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}
