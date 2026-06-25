export type StepId = "search" | "fleet" | "addons" | "terms" | "contact";

export const STEP_ORDER: StepId[] = [
  "search",
  "fleet",
  "addons",
  "terms",
  "contact",
];

export const STEP_LABELS: Record<StepId, string> = {
  search: "Search",
  fleet: "Vehicle",
  addons: "Add-ons",
  terms: "Terms",
  contact: "Details",
};

export type SearchParams = {
  pickupId: string;
  differentDropoff: boolean;
  dropoffId: string;
  fromDate: string; // yyyy-mm-dd
  fromTime: string; // "09:00 AM"
  toDate: string;
  toTime: string;
  age: string; // e.g. "25+"
  promo: string;
};

export type Person = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  licenseNo: string;
  licenseExpiry: string;
  licenseIssue?: string;
};

export type ContactDetails = {
  driver: Person;
  hasAdditional: boolean;
  additional: Person[];
  address: { line: string; city: string; zip: string };
};

export type BookingState = {
  step: StepId;
  search: SearchParams;
  vehicleId: string | null;
  /** addonId -> selected */
  addons: Record<string, boolean>;
  termsAccepted: boolean;
  contact: ContactDetails;
};

export type QuoteLine = { id: string; label: string; amount: number };

export type Quote = {
  days: number;
  distanceAllowed: number; // miles, total
  ratePerDay: number;
  rateTotal: number;
  extras: QuoteLine[];
  extrasTotal: number;
  salesTaxRate: number;
  salesTax: number;
  ocf: number;
  vlf: number;
  totalTax: number;
  estimatedTotal: number;
  deposit: number;
};
