"use client";

import { Command } from "lucide-react";

export function MenuTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-command-menu"))}
      className="fixed top-4 right-4 z-40 rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      aria-label="Open Command Menu"
    >
      <Command size={20} />
    </button>
  );
}