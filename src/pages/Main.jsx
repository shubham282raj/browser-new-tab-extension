import { useEffect, useState } from "react";
import Search from "../components/Search";
import Settings, { SettingsPane } from "../components/Settings";
import { cacheImage, getCachedImage } from "../utils/indexedDB";
import { getBoolLS } from "../utils/utils";
import { getAllBookmarks } from "../utils/bookmark";
import RainCanvas from "../components/Rain";
import RainV2Canvas from "../components/RainV2";

export default function Main() {
  const [toggleSettings, setToggle] = useState(false);

  const bgImageKey = localStorage.getItem("bgImage");

  const [bgUrl, setBgUrl] = useState(!bgImageKey && "background.png");

  useEffect(() => {
    async function loadBackground() {
      let url = await getCachedImage(bgImageKey);

      if (url) setBgUrl(url);
    }

    if (bgImageKey) loadBackground();
  }, []);

  return (
    <div className="h-screen w-screen relative z-0 text-base">
      <div
        className="h-screen w-screen absolute top-0 left-0 bg-cover bg-center"
        style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : "none" }}
      ></div>
      {!getBoolLS("misc_disable_background_rain") &&
        (getBoolLS("misc_rain_version_2") ? <RainV2Canvas /> : <RainCanvas />)}
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
