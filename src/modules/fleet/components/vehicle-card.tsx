"use client";

import { useState } from "react";
import { money } from "../../shared";
import type { Vehicle } from "../types";

export function VehicleCard({
  vehicle,
  days,
  onBook,
}: {
  vehicle: Vehicle;
  days: number;
  onBook: () => void;
}) {
  const [imgOk, setImgOk] = useState(true);
  const total = days > 0 ? vehicle.dailyRate * days : vehicle.dailyRate;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onBook}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onBook();
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-panel">
        {imgOk ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CarGlyph />
          </div>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {vehicle.vClass}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-ink">{vehicle.name}</h3>

        <div className="mt-3 flex items-center gap-4 text-xs text-body">
          <Spec icon="fa-user" value={`${vehicle.seats} seats`} />
          <Spec icon="fa-car-side" value={`${vehicle.doors} doors`} />
          <Spec icon="fa-suitcase" value={`${vehicle.baggage} bags`} />
        </div>

        <div className="mt-auto pt-5">
          <p className="font-display text-2xl font-bold text-ink">
            {money(vehicle.dailyRate)}
            <span className="text-xs font-normal text-muted"> / day</span>
          </p>
          {days > 0 ? (
            <p className="text-xs text-muted">{money(total)} total · {days} day{days > 1 ? "s" : ""}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, value }: { icon: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i className={`fa-solid ${icon} text-muted`} aria-hidden />
      {value}
    </span>
  );
}

function CarGlyph() {
  return (
    <svg viewBox="0 0 64 40" width="96" height="60" aria-hidden role="img">
      <path
        d="M6 28h52M12 28a4 4 0 108 0 4 4 0 00-8 0zm32 0a4 4 0 108 0 4 4 0 00-8 0zM10 28l3-11a4 4 0 014-3h30a4 4 0 013 1l8 9v4"
        fill="none"
        stroke="#9AA5B1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
