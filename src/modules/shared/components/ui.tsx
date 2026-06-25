"use client";

import { cn } from "../lib/cn";

/* ----------------------------------------------------------------- Button */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "pill";
  full?: boolean;
};

export function Button({
  variant = "primary",
  full,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary:
      "bg-brand text-white shadow-card hover:bg-brand-dark hover:shadow-lift active:scale-[0.99]",
    outline: "border border-line-strong bg-surface text-ink hover:border-brand hover:text-brand",
    ghost: "text-body hover:text-ink",
    pill: "rounded-full bg-brand px-4 py-1.5 text-white hover:bg-brand-dark",
  } as const;
  return (
    <button
      className={cn(base, variants[variant], full && "w-full", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ Field */

export function Field({
  label,
  htmlFor,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-ink">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputClass, props.className)} />;
}

/* ----------------------------------------------------------------- Toggle */

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-brand" : "bg-line-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

/* -------------------------------------------------------------- SectionCard */

export function SectionCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6", className)}>
      {title ? (
        <h2 className="mb-5 font-display text-lg font-bold text-ink">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

/* -------------------------------------------------------------- Collapsible */

export function Collapsible({
  title,
  open,
  onToggle,
  complete,
  optional,
  right,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  complete?: boolean;
  optional?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex items-center gap-3 p-5 sm:p-6">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2.5 text-left"
        >
          <h2 className="font-display text-lg font-bold text-ink">
            {title}
            {optional ? (
              <span className="ml-1 font-normal text-muted">(Optional)</span>
            ) : null}
          </h2>
          {complete ? (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
              ✓
            </span>
          ) : null}
        </button>
        {right}
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? "Collapse section" : "Expand section"}
          className="text-muted"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform duration-200", open && "rotate-180")}
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {open ? <div className="px-5 pb-6 sm:px-6">{children}</div> : null}
    </section>
  );
}
