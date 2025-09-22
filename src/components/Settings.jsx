import React, { useState } from "react";
import { simplifyUrl } from "./SuggestionBox";
import { addFavorite, deleteFavorite, getFavs } from "../utils/Favorites";
import { formatLSValue } from "../utils/formatter";
import ToggleBtn, { LSTextField, ToggleLSBtn } from "./ToggleBtn";
import { getBoolLS, toggleLSKey } from "../utils/utils";

export function SettingsPane({ onClose }) {
  const subpanes = {
    Favorites: FavoriteSettingPane,
    "Search Engine": SearchEnginePane,
    "Background Rain": BackgroundSettings,
    Misc: MiscellaneousPane,
  };

  const [selected, setSelected] = useState("Favorites");

  const SelectedPane = subpanes[selected];

  return (
    <div
      className="h-screen w-screen absolute backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute -translate-1/2 left-1/2 top-1/2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="bg-white/5 w-2xl min-h-40 rounded-xl p-4 flex flex-col gap-2 shadow">
          <div className="flex h-fit gap-2">
            {Object.keys(subpanes).map((name, idx) => (
              <button
                key={name}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selected == name ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => setSelected(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <hr></hr>

          <div className="my-2">
            <SelectedPane />
          </div>
        </div>
      </div>
    </div>
  );
}

function FavoriteSettingPane() {
  const [favs, setFavs] = useState(getFavs());

  const refreshFavs = () => {
    setFavs(getFavs());
  };

  return (
    <div className="max-h-70 overflow-y-auto flex flex-col gap-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formdata = new FormData(e.target);
          const data = Object.fromEntries(formdata.entries());
          addFavorite(data);
          refreshFavs();
          e.target.reset();
        }}
      >
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          autoFocus
          className="grow-1 text-md outline-0 bg-white/5 px-4 py-2 rounded-lg"
        />
        <input
          type="text"
          name="url"
          required
          placeholder="URL"
          className="grow-1 text-md outline-0 bg-white/5 px-4 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-white/5 px-5 rounded-lg  cursor-pointer"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2 cursor-pointer">
        {
          // [
          //   ...favs,
          //   {
          //     name: "",
          //     url: "",
          //   },
          // ]
          favs.map((fav) => (
            <div
              key={fav.name + fav.url}
              className="flex flex-row gap-2 py-1 px-3 bg-white/5 rounded-md "
              title={fav.url}
            >
              {fav.name || <img src="plus.svg" className="invert opacity-60" />}
              {fav.name && (
                <div
                  className=""
                  onClick={(e) => {
                    e.stopPropagation();
                    const confirm = window.confirm(
                      "You want to delete it, right?"
                    );
                    if (confirm) {
                      deleteFavorite(fav);
                      refreshFavs();
                    }
                  }}
                >
                  <img src="trash.svg" className="invert opacity-80 w-5" />
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

function BackgroundSettings() {
  const boolSettings = {
    misc_disable_background_rain: null,
  };

  const textSettings = {
    misc_rain_speed: "Relative Rain Speed Change | Defaut: 1",
    misc_rain_density: "Relative Rain Density Change | Defaut: 1",
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <div className="w-full text-center mb-2">
          Some of these settings may require page refresh
        </div>

        {Object.keys(boolSettings).map((val) => (
          <div
            key={val}
            className="flex items-center gap-2 bg-white/5 py-2 px-5 rounded-lg"
          >
            <div>{formatLSValue(val)}</div>
            <ToggleLSBtn lsKey={val} toggleCB={boolSettings[val]} />
          </div>
        ))}

        {Object.keys(textSettings).map((val) => (
          <LSTextField lsKey={val} placeholder={textSettings[val]} />
        ))}
      </div>
    </div>
  );
}

function SearchEnginePane() {
  return (
    <div>
      <div className="flex gap-2">
        <div className="text-md outline-0 px-4 py-2 rounded-lg">
          Defaut Page
        </div>
        <input
          type="text"
          required
          onChange={(e) => {
            localStorage.setItem("defaultSearch", e.target.value);
          }}
          autoFocus
          defaultValue={localStorage.getItem("defaultSearch")}
          placeholder="URL (This would open if you press Enter with no text)"
          className="grow-1 text-md outline-0 bg-white/5 px-4 py-2 rounded-lg"
        />
      </div>

      <div></div>
    </div>
  );
}

function MiscellaneousPane() {
  const boolSettings = {
    misc_hide_clock: null,
    misc_hide_date: null,
    misc_always_show_search_caret: null,
    misc_hide_search_icon: null,
    misc_hide_search_bar_if_no_text: null,
    misc_12_hour_format: null,
    misc_hide_web_icons: null,
    misc_always_show_favorites: null,
  };

  const textSettings = {
    // misc_favorite_bar_opacity: "Range: [0, 100] Defaut: 70",
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(boolSettings).map((val) => (
          <div
            key={val}
            className="flex items-center gap-2 bg-white/5 py-2 px-5 rounded-lg"
          >
            <div>{formatLSValue(val)}</div>
            <ToggleLSBtn lsKey={val} toggleCB={boolSettings[val]} />
          </div>
        ))}

        {Object.keys(textSettings).map((val) => (
          <LSTextField lsKey={val} placeholder={textSettings[val]} />
        ))}
      </div>
    </div>
  );
}

export default function Settings({ onClick }) {
  return (
    <>
      <button
        className="cursor-pointer px-2 flex"
        title="Settings"
        onClick={onClick}
      >
        <img
          src="setting.svg"
          alt="settings icon"
          className="invert opacity-0 hover:opacity-40 hover:rotate-45 transition-all duration-200 w-7"
        />
      </button>
    </>
  );
}
