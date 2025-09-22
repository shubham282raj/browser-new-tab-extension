import { useState } from "react";
import { toggleLSKey } from "../utils/utils";
import { formatLSValue } from "../utils/formatter";

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

export function LSTextField({ lsKey, placeholder }) {
  return (
    <div key={lsKey} className="flex items-center gap-2 w-full px-2">
      <div>{formatLSValue(lsKey)}</div>
      <input
        type="text"
        required
        onChange={(e) => {
          localStorage.setItem(lsKey, e.target.value.trim());
        }}
        defaultValue={localStorage.getItem(lsKey)}
        placeholder={placeholder}
        className="grow-1 text-md outline-0 bg-white/5 px-4 py-2 rounded-lg"
      />
    </div>
  );
}
