"use client";

import { AddonsStep } from "../../addons";
import { ContactStep } from "../../contact";
import { FleetStep } from "../../fleet";
import { SearchStep } from "../../search";
import { TermsStep } from "../../terms";
import { cn } from "../../shared";
import { BookingProvider, useBooking } from "../context/booking-context";
import { STEP_LABELS, STEP_ORDER, type StepId } from "../types";

const STEP_VIEW: Record<StepId, React.ComponentType> = {
  search: SearchStep,
  fleet: FleetStep,
  addons: AddonsStep,
  terms: TermsStep,
  contact: ContactStep,
};

function Progress() {
  const { state } = useBooking();
  const active = STEP_ORDER.indexOf(state.step);
  return (
    <ol className="mb-6 flex items-center gap-2">
      {STEP_ORDER.map((id, i) => {
        const done = i < active;
        const on = i === active;
        return (
          <li key={id} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                on && "bg-brand text-white",
                done && "bg-brand-dark text-white",
                !on && !done && "bg-panel text-muted",
              )}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:inline",
                on ? "text-ink" : "text-muted",
              )}
            >
              {STEP_LABELS[id]}
            </span>
            {i < STEP_ORDER.length - 1 ? (
              <span
                className={cn("h-px flex-1", done ? "bg-brand-dark" : "bg-line")}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function WizardInner() {
  const { state } = useBooking();

  // Terms is shown as a modal layered over the Add-Ons step.
  if (state.step === "terms") {
    return (
      <div>
        <Progress />
        <AddonsStep />
        <TermsStep />
      </div>
    );
  }

  const StepView = STEP_VIEW[state.step];
  return (
    <div>
      <Progress />
      <StepView />
    </div>
  );
}

export function BookingWizard() {
  return (
    <BookingProvider>
      <WizardInner />
    </BookingProvider>
  );
}
