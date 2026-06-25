"use client";

import { useEffect, useRef, useState } from "react";
import { cn, inputClass } from "../../shared";
import { TIME_OPTIONS } from "../lib/locations";

export function TimeSelect({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    // bring the selected time into view when opening
    const sel = listRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
    sel?.scrollIntoView({ block: "center" });
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(inputClass, "flex items-center justify-between text-left")}
      >
        <span className="flex items-center gap-2">
          <ClockIcon />
          {value}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("text-muted transition-transform", open && "rotate-180")}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-lift"
        >
          {TIME_OPTIONS.map((t) => {
            const selected = t === value;
            return (
              <li
                key={t}
                role="option"
                aria-selected={selected}
                data-selected={selected}
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer px-3.5 py-2 text-sm transition-colors",
                  selected
                    ? "bg-brand font-medium text-white"
                    : "text-ink hover:bg-brand-tint",
                )}
              >
                {t}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
