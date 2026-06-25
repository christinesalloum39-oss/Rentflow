"use client";

import { useBooking } from "../../booking/context/booking-context";
import { Button, Field, Input, Select, Toggle } from "../../shared";
import { AGE_OPTIONS, LOCATIONS } from "../lib/locations";
import { TimeSelect } from "./time-select";

export function SearchStep() {
  const { state, patchSearch, next } = useBooking();
  const { search } = state;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-line bg-white shadow-card">
        <div className="rounded-t-2xl bg-brand px-6 py-4">
          <h2 className="font-display text-xl font-bold text-white">Book Now</h2>
        </div>

        <div className="space-y-6 p-6">
          <Field label="Pickup / Drop off Location" htmlFor="pickup">
            <Select
              id="pickup"
              value={search.pickupId}
              onChange={(e) => patchSearch({ pickupId: e.target.value })}
            >
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.address}
                </option>
              ))}
            </Select>
          </Field>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-ink">
              Different Drop off Location:
            </span>
            <Toggle
              on={search.differentDropoff}
              label="Different drop off location"
              onChange={(v) => patchSearch({ differentDropoff: v })}
            />
          </div>

          {search.differentDropoff ? (
            <Field label="Drop off Location" htmlFor="dropoff">
              <Select
                id="dropoff"
                value={search.dropoffId}
                onChange={(e) => patchSearch({ dropoffId: e.target.value })}
              >
                {LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.address}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          <DateTimeRow
            icon="↑"
            label="From"
            date={search.fromDate}
            time={search.fromTime}
            onDate={(v) => patchSearch({ fromDate: v })}
            onTime={(v) => patchSearch({ fromTime: v })}
          />
          <DateTimeRow
            icon="↓"
            label="To"
            date={search.toDate}
            time={search.toTime}
            minDate={search.fromDate}
            onDate={(v) => patchSearch({ toDate: v })}
            onTime={(v) => patchSearch({ toTime: v })}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Age" htmlFor="age">
              <Select
                id="age"
                value={search.age}
                onChange={(e) => patchSearch({ age: e.target.value })}
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    Age {a}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Promotion Code" htmlFor="promo" optional>
              <Input
                id="promo"
                value={search.promo}
                placeholder="Promotion Code"
                onChange={(e) => patchSearch({ promo: e.target.value })}
              />
            </Field>
          </div>

          <Button full onClick={next} disabled={!search.fromDate || !search.toDate}>
            ⌕ Search
          </Button>
        </div>
      </div>
    </div>
  );
}

function DateTimeRow({
  icon,
  label,
  date,
  time,
  minDate,
  onDate,
  onTime,
}: {
  icon: string;
  label: string;
  date: string;
  time: string;
  minDate?: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 inline-flex items-center gap-1.5 rounded bg-panel px-2.5 py-1 text-xs font-semibold text-ink">
        <span aria-hidden>{icon}</span> {label}
      </span>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="date"
          value={date}
          min={minDate}
          onChange={(e) => onDate(e.target.value)}
        />
        <TimeSelect value={time} onChange={onTime} />
      </div>
    </div>
  );
}
