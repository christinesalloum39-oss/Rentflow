"use client";

import { useMemo, useState } from "react";
import { useBooking } from "../../booking/context/booking-context";
import { TripBar } from "../../booking/components/trip-bar";
import { VEHICLES } from "../lib/vehicles";
import type { Vehicle } from "../types";
import { VehicleCard } from "./vehicle-card";

type ClassFilter = "All" | Vehicle["vClass"];
const CLASSES: ClassFilter[] = ["All", "Van", "SUV", "Sedan", "Economy"];

export function FleetStep() {
  const { quote, selectVehicle, next, back } = useBooking();
  const [vClass, setVClass] = useState<ClassFilter>("All");
  const [sort, setSort] = useState<"priceAsc" | "priceDesc">("priceAsc");

  const vehicles = useMemo(() => {
    const list = VEHICLES.filter((v) => vClass === "All" || v.vClass === vClass);
    list.sort((a, b) =>
      sort === "priceAsc" ? a.dailyRate - b.dailyRate : b.dailyRate - a.dailyRate,
    );
    return list;
  }, [vClass, sort]);

  return (
    <div className="space-y-5">
      <TripBar />

      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink">Choose your ride</h1>
        <p className="text-sm text-body">
          {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} available for your dates.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {CLASSES.map((c) => {
            const active = vClass === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setVClass(c)}
                className={[
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-line-strong bg-surface text-body hover:border-brand hover:text-brand",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>

        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-sm text-ink focus:border-brand focus:outline-none"
          >
            <option value="priceAsc">Price · low to high</option>
            <option value="priceDesc">Price · high to low</option>
          </select>
        </label>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center text-sm text-muted">
          No vehicles in this class. Try another filter.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              days={quote.days}
              onBook={() => {
                selectVehicle(v.id);
                next();
              }}
            />
          ))}
        </div>
      )}

      <div className="pt-1">
        <button
          type="button"
          onClick={back}
          className="text-sm font-semibold text-body hover:text-ink"
        >
          ‹ Modify search
        </button>
      </div>
    </div>
  );
}
