import { useState } from "react";
import { toggleLSKey } from "../utils/utils";

export default function ToggleBtn({ getVal, onToggle }) {
  const [value, setValue] = useState(getVal() == "true");

  return (
    <div
      className="bg-white/50 w-4 h-4 rounded-full p-1 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
        setValue(getVal() == "true");
      }}
    >
      <div
        className={`h-full w-full rounded-full ${value && "bg-neutral-800"}`}
      ></div>
    </div>
  );
}

export function ToggleLSBtn({ lsKey, toggleCB = null }) {
  return (
    <ToggleBtn
      getVal={() => localStorage.getItem(lsKey)}
      onToggle={() => {
        toggleLSKey(lsKey);
        if (toggleCB) toggleCB();
      }}
    />
  );
}
