"use client";

import { useEffect } from "react";
import { useBooking } from "../../booking/context/booking-context";
import { Button } from "../../shared";
import { TERMS_CLAUSES, TERMS_INTRO } from "../lib/terms-text";

/** Terms & Conditions rendered as a modal dialog over the Add-Ons step. */
export function TermsStep() {
  const { state, setTerms, back, next } = useBooking();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [back]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
        onClick={back}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terms and Conditions"
        className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-line bg-white shadow-lift"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-bold text-ink">
            Terms and Conditions
          </h2>
          <button
            type="button"
            onClick={back}
            aria-label="Close"
            className="text-muted transition-colors hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-sm text-body">{TERMS_INTRO}</p>
          <div className="mt-3 space-y-3">
            {TERMS_CLAUSES.map((c, i) => (
              <p key={i} className="text-xs leading-relaxed text-body">
                {c}
              </p>
            ))}
          </div>
        </div>

        <div className="border-t border-line px-6 py-4">
          <label className="flex items-center gap-3 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand"
              checked={state.termsAccepted}
              onChange={(e) => setTerms(e.target.checked)}
            />
            I have read and understood the Terms &amp; Conditions above.
          </label>
          <div className="mt-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={back}>
              ‹ Previous
            </Button>
            <Button disabled={!state.termsAccepted} onClick={next}>
              ✓ Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
