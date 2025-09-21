import React, { useEffect, useState } from "react";
import { getBoolLS } from "../utils/utils";

export default function DateAndTime({ visible }) {
  const hideClock = getBoolLS("misc_hide_clock");
  const hideDate = getBoolLS("misc_hide_date");

  if (hideClock && hideDate) return null;

  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();

      setTime({ hours, minutes, seconds, day, month, year });
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const hourmodulo = localStorage.getItem("12hourformat") == "true" ? 12 : 24;

  return time ? (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-2/6 flex flex-col items-center gap-2 transition-all duration-300 ease-in-out select-none"
      style={{ opacity: visible ? 0.8 : 0 }}
    >
      {!hideClock && (
        <div className="flex text-9xl items-end font-bold gap-3">
          <div>{time.hours % hourmodulo}</div>
          <div className="-translate-y-2.5">:</div>
          <div>{time.minutes}</div>
          <div className="text-3xl">{time.seconds}</div>
        </div>
      )}

      {!hideDate && (
        <div className="flex gap-1 text-lg font-semibold">
          <div>{time.day}</div>
          <div>{time.month}</div>
          <div>{time.year}</div>
        </div>
      )}
    </div>
  ) : null;
}
