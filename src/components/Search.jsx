import { lazy, Suspense, useEffect, useRef, useState } from "react";
import DateAndTime from "./DateAndTime";
import { getBoolLS } from "../utils/utils";

const SuggestionBox = lazy(() => import("./SuggestionBox"));
const Bookmarks = lazy(() => import("./Bookmarks"));
const ToDo = lazy(() => import("./ToDo"));

export default function Search({ settingsIcon }) {
  const [text, setText] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const keydownHandler = (e) => {
      if (searchRef.current && !isAnyInputFocused()) {
        searchRef.current.focus();
      }
    };

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, []);

  return (
    <>
      <Suspense fallback={<></>}>
        <ToDo />
      </Suspense>
      <div className={`absolute top-1/2 left-1/2 -translate-1/2 select-none`}>
        <DateAndTime visible={!text.trim()} />

        <div
          className={`${
            getBoolLS("misc_hide_search_bar_if_no_text") &&
            !text &&
            "opacity-0 transition-opacity duration-300"
          }`}
        >
          {/* serach bar */}
          <div className="border border-gray-600 backdrop-blur-sm w-2xl h-[46px] rounded-full px-2 flex">
            {!getBoolLS("misc_hide_search_icon") ? (
              <img
                src="search.svg"
                alt="serach icon"
                className="p-2.5 invert opacity-80"
              />
            ) : (
              <div className="px-3"></div>
            )}

            <input
              type="text"
              className={`outline-none flex-1 text-lg ${
                !getBoolLS("misc_always_show_search_caret") &&
                !text &&
                "caret-transparent"
              }`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              ref={searchRef}
            />

            {settingsIcon}
          </div>

          <Suspense fallback={<></>}>
            <SuggestionBox searchText={text.trim()} />
          </Suspense>

          {!text.trim() && (
            <Suspense fallback={<></>}>
              <Bookmarks />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
}

function isAnyInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}
