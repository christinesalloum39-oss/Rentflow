"use client";

import { Button } from "../../shared";
import { useBooking } from "../context/booking-context";

export function StepFooter({
  nextLabel = "Next",
  showBack = true,
  onNext,
}: {
  nextLabel?: string;
  showBack?: boolean;
  onNext?: () => void;
}) {
  const { canAdvance, back, next } = useBooking();
  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      {showBack ? (
        <Button variant="outline" onClick={back}>
          ‹ Previous
        </Button>
      ) : null}
      <Button disabled={!canAdvance} onClick={onNext ?? next}>
        {nextLabel} ›
      </Button>
    </div>
  );
}
