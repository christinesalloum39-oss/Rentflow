import { getVehicleById } from "../../fleet/lib/vehicles";
import { getAddonById } from "../../addons/lib/addons";
import { rentalDays, round2 } from "../../shared/lib/format";
import type { Quote } from "../types";

/** Taxes & fees, matched to the reference receipt. */
export const TAX_CONFIG = {
  salesTaxRate: 0.0745, // 7.45%
  ocf: 4, // Operating Cost Fee
  vlf: 4, // Vehicle Licence Fee
};

const EMPTY: Quote = {
  days: 0,
  distanceAllowed: 0,
  ratePerDay: 0,
  rateTotal: 0,
  extras: [],
  extrasTotal: 0,
  salesTaxRate: TAX_CONFIG.salesTaxRate,
  salesTax: 0,
  ocf: 0,
  vlf: 0,
  totalTax: 0,
  estimatedTotal: 0,
  deposit: 0,
};

type Input = {
  vehicleId: string | null;
  addons: Record<string, boolean>;
  fromDate: string;
  toDate: string;
};

export function computeQuote({ vehicleId, addons, fromDate, toDate }: Input): Quote {
  const vehicle = getVehicleById(vehicleId);
  const days = rentalDays(fromDate, toDate);
  if (!vehicle || days === 0) return EMPTY;

  const rateTotal = vehicle.dailyRate * days;

  const extras = Object.entries(addons)
    .filter(([, on]) => on)
    .map(([id]) => getAddonById(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => ({ id: a.id, label: a.name, amount: a.pricePerDay * days }));
  const extrasTotal = extras.reduce((s, e) => s + e.amount, 0);

  const taxable = rateTotal + extrasTotal;
  const salesTax = round2(taxable * TAX_CONFIG.salesTaxRate);
  const totalTax = round2(salesTax + TAX_CONFIG.ocf + TAX_CONFIG.vlf);
  const estimatedTotal = round2(taxable + totalTax);

  return {
    days,
    distanceAllowed: vehicle.distancePerDay * days,
    ratePerDay: vehicle.dailyRate,
    rateTotal,
    extras,
    extrasTotal,
    salesTaxRate: TAX_CONFIG.salesTaxRate,
    salesTax,
    ocf: TAX_CONFIG.ocf,
    vlf: TAX_CONFIG.vlf,
    totalTax,
    estimatedTotal,
    deposit: vehicle.deposit,
  };
}
