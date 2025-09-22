import { useEffect, useState } from "react";
import Search from "../components/Search";
import Settings, { SettingsPane } from "../components/Settings";
import { cacheImage, getCachedImage } from "../utils/indexedDB";
import { getBoolLS } from "../utils/utils";
import { getAllBookmarks } from "../utils/bookmark";
import RainCanvas from "../components/Rain";

export default function Main() {
  const [toggleSettings, setToggle] = useState(false);

  const [bgUrl, setBgUrl] = useState("background.png");

  // useEffect(() => {
  //   async function loadBackground() {
  //     // get cached image
  //     let url = await getCachedImage("background");

  //     // if not cached, fetch and cache it
  //     if (!url) {
  //       const bgPath = `${import.meta.env.BASE_URL}background.png`;
  //       await cacheImage(bgPath, "background");
  //       url = await getCachedImage("background");
  //     }

  //     setBgUrl(url);
  //   }

  //   loadBackground();
  // }, []);

  return (
    <div className="h-screen w-screen relative z-0 text-base">
      <div
        className="h-screen w-screen absolute top-0 left-0 bg-cover bg-center"
        style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : "none" }}
      ></div>
      <RainCanvas />
      <div className="overlayGradient"></div>

      {toggleSettings ? (
        <SettingsPane onClose={() => setToggle(false)} />
      ) : (
        <Search
          settingsIcon={<Settings onClick={() => setToggle((v) => !v)} />}
        />
      )}
    </div>
  );
}
