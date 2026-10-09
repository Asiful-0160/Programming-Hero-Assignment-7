"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("bn-BD", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka",
});

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function getSnapshot() { return formatter.format(new Date()); }
function getServerSnapshot() { return ""; }

export function BengaliDate() {
  const date = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <p className="mt-1 min-h-5 text-[11px] leading-5 text-slate-500 sm:text-xs">{date || "আজকের বাজারের খবর"}</p>;
}
