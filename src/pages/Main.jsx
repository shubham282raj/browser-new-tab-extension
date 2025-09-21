import React, { useState } from "react";
import Search from "../components/Search";
import Settings, { SettingsPane } from "../components/Settings";

export default function Main() {
  const [toggleSettings, setToggle] = useState(false);

  return (
    <div
      className="h-screen w-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url("background.png")` }}
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
