"use client";

import { getVehicleById } from "../../fleet/lib/vehicles";
import { longDateTime, money } from "../../shared";
import { useBooking } from "../context/booking-context";

export function RentalDetails() {
  const { state, quote } = useBooking();
  const vehicle = getVehicleById(state.vehicleId);
  const { search } = state;

  return (
    <aside className="rounded-2xl border border-line bg-white shadow-card p-5">
      <h2 className="font-display text-lg font-bold text-ink">Rental Details</h2>

      <Block label="Location & Date">
        <p className="text-xs text-body">
          {longDateTime(search.fromDate, search.fromTime)}
        </p>
        <p className="text-xs text-body">
          {longDateTime(search.toDate, search.toTime)}
        </p>
      </Block>

      {!vehicle ? (
        <p className="mt-4 text-sm text-muted">
          Select a vehicle to see your full quote.
        </p>
      ) : (
        <>
          <h3 className="mt-5 font-display text-base font-bold text-ink">
            {vehicle.name}
          </h3>

          <Block label="Rate">
            <Row
              left="Distance Allowed"
              right={`${quote.distanceAllowed} miles`}
              muted
            />
            <Row
              left={`${quote.days} Day(s) @ ${quote.ratePerDay} $ / Day`}
              right={`+ ${money(quote.rateTotal)}`}
            />
          </Block>

          {quote.extras.length > 0 ? (
            <Block label="Extras">
              {quote.extras.map((e) => (
                <Row key={e.id} left={e.label} right={`+ ${money(e.amount)}`} />
              ))}
            </Block>
          ) : null}

          <Block label="Taxes & Fees">
            <Row
              left={`Sales Tax ${(quote.salesTaxRate * 100).toFixed(2)}%`}
              right={`+ ${money(quote.salesTax)}`}
            />
            <Row left="OCF" right={`+ ${money(quote.ocf)}`} />
            <Row left="VLF" right={`+ ${money(quote.vlf)}`} />
            <div className="mt-2 border-t border-line pt-2">
              <Row left="Total Tax" right={`+ ${money(quote.totalTax)}`} />
            </div>
          </Block>

          <div className="mt-5 border-t border-line pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink">
                Estimated Total
              </span>
              <span className="font-display text-xl font-bold text-ink">
                {money(quote.estimatedTotal)}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xs font-semibold text-body">Total Charge</span>
              <span className="text-sm text-body">{money(quote.estimatedTotal)}</span>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              + {money(quote.deposit)} refundable deposit, due at pickup.
            </p>
          </div>
        </>
      )}
    </aside>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-md bg-panel p-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink">
        {label}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({
  left,
  right,
  muted,
}: {
  left: string;
  right: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className={muted ? "text-muted" : "text-body"}>{left}</span>
      <span className="whitespace-nowrap text-body">{right}</span>
    </div>
  );
}
