import React, { useEffect, useRef, useState } from "react";
import { simplifyUrl } from "./SuggestionBox";
import { addFavorite, deleteFavorite, getFavs } from "../utils/Favorites";
import { formatLSValue } from "../utils/formatter";
import ToggleBtn, { LSTextField, ToggleLSBtn } from "./ToggleBtn";
import { getBoolLS, toggleLSKey } from "../utils/utils";
import {
  cacheUploadedImage,
  deleteCachedImage,
  getCachedImage,
  listCachedImageKeys,
} from "../utils/indexedDB";

export function SettingsPane({ onClose }) {
  const subpanes = {
    Favorites: FavoriteSettingPane,
    "Search Engine": SearchEnginePane,
    Background: BackgroundSettings,
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
        <div className="bg-white/5 w-2xl  rounded-xl p-4 flex flex-col gap-2 shadow">
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
      <div className="text-center">
        You may consider these additional bookmarks
      </div>

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
        {favs.map((fav) => (
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
        ))}
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

        <BackgroundImage />
      </div>
    </div>
  );
}

function BackgroundImage() {
  function _BGImageComp({ src, isSelected, selectFn, deleteFn }) {
    return (
      <div className="h-35 aspect-video border-neutral-400 group relative first:rounded-bl-lg last:rounded-br-lg overflow-clip">
        <img
          src={src}
          alt=""
          className="h-full w-full bg-cover bg-center object-cover"
        />

        <button
          className={`absolute top-1/2 left-1/2 -translate-1/2 py-1 px-3 rounded-full not-disabled:cursor-pointer transition-opacity duration-200 ${
            isSelected
              ? "bg-black/70"
              : "opacity-0 group-hover:opacity-100 bg-black/70"
          }`}
          disabled={isSelected}
          onClick={(e) => {
            e.stopPropagation();
            selectFn();
          }}
        >
          {isSelected ? "Selected" : "Select"}
        </button>

        {deleteFn && (
          <button
            className="absolute w-9 h-9 p-2 m-1 top-0 right-0 invert bg-white/50 rounded-lg cursor-pointer opacity-0 group-hover:opacity-70 transition-opacity"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              deleteFn();
            }}
          >
            <img src="trash.svg" alt="" className="w-full h-full" />
          </button>
        )}
      </div>
    );
  }

  const [imageURLs, setImageURLs] = useState({});
  const [selectedImg, setSelectedImg] = useState(
    localStorage.getItem("bgImage") || "default"
  );

  const getImageURLs = async () => {
    for (const prevUrl of Object.values(imageURLs)) {
      URL.revokeObjectURL(prevUrl);
    }

    return listCachedImageKeys().then(async (keys) => {
      console.log("hle");
      const urls = {};
      for (const key of keys) {
        const url = await getCachedImage(key);
        if (url) urls[key] = url;
      }

      setImageURLs(urls);
    });
  };

  useEffect(() => {
    getImageURLs();
  }, []);

  const setAsBgImage = (name) => {
    if (name) {
      localStorage.setItem("bgImage", name);
    } else {
      localStorage.removeItem("bgImage");
    }

    setSelectedImg(localStorage.getItem("bgImage") || "default");
  };

  const deleteImage = async (imgkey) => {
    const bool = confirm("Are you sure you want to delete this image?");
    if (!bool || Number(imgkey) == NaN) return;

    if (localStorage.getItem("bgImage") == imgkey) {
      localStorage.removeItem("bgImage");
    }

    await deleteCachedImage(Number(imgkey));
    await getImageURLs();
    setSelectedImg(localStorage.getItem("bgImage") || "default");
  };

  return (
    <div className="p-2 flex flex-col gap-2 w-full select-none">
      <div className="flex justify-between items-center">
        <div>Set Background Image</div>
        <UploadButton cb={getImageURLs} />
      </div>
      <div className="flex overflow-x-scroll gap-2">
        {Object.keys(imageURLs)
          .reverse()
          .map((imgkey) => (
            <_BGImageComp
              key={imgkey}
              src={imageURLs[imgkey]}
              selectFn={() => setAsBgImage(imgkey)}
              deleteFn={() => deleteImage(imgkey)}
              isSelected={selectedImg == imgkey}
            />
          ))}

        <_BGImageComp
          src={"background.png"}
          selectFn={() => setAsBgImage(null)}
          isSelected={selectedImg == "default"}
        />
      </div>
    </div>
  );
}

function UploadButton({ cb }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await cacheUploadedImage(file, new Date().getTime());
      if (cb) cb();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center bg-white/5 px-3 py-1 rounded-lg cursor-pointer"
      >
        Add
        <img src="plus.svg" className="invert opacity-80 ml-2" alt="plus" />
      </button>

      {/* hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
}

function SearchEnginePane() {
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="text-center">More to come</div> */}
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
