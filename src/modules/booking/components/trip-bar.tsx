"use client";

import { getLocationById } from "../../search/lib/locations";
import { shortDate } from "../../shared";
import { useBooking } from "../context/booking-context";

export function TripBar() {
  const { state, goto } = useBooking();
  const { search } = state;
  const pickup = getLocationById(search.pickupId);
  const dropoff = getLocationById(search.dropoffId);

  const cell = (label: string, value: string) => (
    <div className="bg-surface px-4 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="truncate text-xs font-medium text-ink">{value}</p>
    </div>
  );

  return (
    <button
      type="button"
      onClick={() => goto("search")}
      aria-label="Edit search details"
      className="group grid w-full grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-left shadow-card transition-colors hover:border-brand sm:grid-cols-4"
    >
      {cell("Pickup Location", pickup?.name ?? "—")}
      {cell("Drop off Location", dropoff?.name ?? "—")}
      {cell("From", `${shortDate(search.fromDate)} ${search.fromTime}`)}
      {cell("To", `${shortDate(search.toDate)} ${search.toTime}`)}
    </button>
  );
}
