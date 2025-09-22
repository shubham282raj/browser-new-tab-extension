import { useEffect, useState } from "react";
import { getAllBookmarks } from "../utils/bookmark";
import { getBoolLS, getLS } from "../utils/utils";

export default function Bookmarks() {
  const [bms, setBms] = useState([]);

  useEffect(() => {
    getAllBookmarks().then((flatbms) => setBms(flatbms));
  }, []);

  return (
    <div
      className={`absolute flex flex-wrap justify-center gap-2 max-w-full p-2 mt-4 ${
        getBoolLS("misc_always_show_favorites")
          ? "opacity-70"
          : "opacity-0 hover:opacity-70 transition-opacity duration-300"
      }`}
    >
      {bms.map((bm) => (
        <a
          href={bm.url}
          rel="noopener noreferrer"
          className="flex items-center gap-1 p-2 cursor-pointer rounded-lg bg-white/10 w-30"
        >
          {!getBoolLS("misc_hide_web_icons") && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${
                new URL(bm.url).hostname
              }&sz=32`}
              alt=""
              onLoad={(e) => {
                const img = e.currentTarget;
                // Google dummy favicon is 16x16 or very small
                if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
                  img.src = "globe.svg";
                  img.className += " invert ";
                }
              }}
              className="w-5 aspect-square "
            />
          )}

          <div className="truncate text-center flex-grow text-sm">
            {bm.title}
          </div>
        </a>
      ))}
    </div>
  );
}
