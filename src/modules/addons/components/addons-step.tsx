"use client";

import { useState } from "react";
import { useBooking } from "../../booking/context/booking-context";
import { RentalDetails } from "../../booking/components/rental-details";
import { StepFooter } from "../../booking/components/step-footer";
import { cn } from "../../shared";
import { ADDONS } from "../lib/addons";

export function AddonsStep() {
  const { state, toggleAddon } = useBooking();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="rounded-2xl border border-line bg-white shadow-card p-5 sm:p-6">
          <h2 className="mb-5 font-display text-2xl font-bold text-ink">
            Select Add-Ons
          </h2>

          <div className="space-y-3">
            {ADDONS.map((addon) => {
              const on = !!state.addons[addon.id];
              const expanded = open === addon.id;
              return (
                <div
                  key={addon.id}
                  className={cn(
                    "rounded-xl border bg-white px-4 py-3",
                    expanded ? "border-info" : "border-line",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <p className="flex-1 font-semibold text-ink">{addon.name}</p>
                    {on ? (
                      <button
                        type="button"
                        onClick={() => toggleAddon(addon.id, false)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1.5 text-xs font-semibold text-success"
                      >
                        <i className="fa-solid fa-check" aria-hidden />
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleAddon(addon.id, true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                      >
                        <i className="fa-solid fa-plus" aria-hidden />
                        Add
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={expanded ? "Collapse" : "Expand"}
                      onClick={() => setOpen(expanded ? null : addon.id)}
                      className="px-1 text-muted transition-colors hover:text-ink"
                    >
                      <i
                        className={cn(
                          "fa-solid",
                          expanded ? "fa-chevron-up" : "fa-chevron-down",
                        )}
                        aria-hidden
                      />
                    </button>
                  </div>
                  {expanded ? (
                    <div className="mt-2 space-y-2 border-t border-line pt-2">
                      {addon.detail ? (
                        <p className="text-xs text-body">• {addon.detail}</p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-panel px-2.5 py-1 text-xs text-body">
                          Per hour
                          <span className="font-semibold text-ink">
                            ${addon.pricePerHour.toFixed(2)}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-panel px-2.5 py-1 text-xs text-body">
                          Per day
                          <span className="font-semibold text-ink">
                            ${addon.pricePerDay.toFixed(2)}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <StepFooter nextLabel="Next" />
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <RentalDetails />
      </div>
    </div>
  );
}
