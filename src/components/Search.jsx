import { useEffect, useRef, useState } from "react";
import SuggestionBox from "./SuggestionBox";
import DateAndTime from "./DateAndTime";

export default function Search({ settingsIcon }) {
  const [text, setText] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const keydownHandler = (e) => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    };

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, []);

  return (
    <>
      <DateAndTime visible={!text.trim()} />

      <div className="absolute top-1/2 left-1/2 -translate-1/2">
        <div className="border border-gray-600 backdrop-blur-sm w-2xl h-[46px] rounded-full px-2 flex">
          <img
            src="search.svg"
            alt="serach icon"
            className="p-2.5 invert opacity-80"
          />

          <input
            type="text"
            className="outline-none flex-1 text-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={searchRef}
          />

          {settingsIcon}
        </div>

        <SuggestionBox searchText={text.trim()} />
      </div>
    </>
  );
}
