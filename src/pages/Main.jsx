import React, { useState } from "react";
import Search from "../components/Search";
import Settings, { SettingsPane } from "../components/Settings";

export default function Main() {
  const [toggleSettings, setToggle] = useState(false);

  async function getAutocomplete(query) {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // CORS proxy
    const targetUrl = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(proxyUrl + targetUrl);
    const data = await res.json();
    return data[1]; // array of suggestions
  }

  // Example usage
  getAutocomplete("react").then((suggestions) => console.log(suggestions));

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
