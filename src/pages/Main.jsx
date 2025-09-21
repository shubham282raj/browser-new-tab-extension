import { useEffect, useState } from "react";
import Search from "../components/Search";
import Settings, { SettingsPane } from "../components/Settings";
import { cacheImage, getCachedImage } from "../utils/indexedDB";

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
    <div
      className="h-screen w-screen relative bg-cover bg-center"
      style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : "none" }}
    >
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
