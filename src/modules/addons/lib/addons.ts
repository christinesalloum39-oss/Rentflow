export type Addon = {
  id: string;
  name: string;
  detail?: string;
  pricePerHour: number;
  pricePerDay: number;
};

/** Liability + age-based charges. Each shows both an hourly and daily price. */
export const ADDONS: Addon[] = [
  {
    id: "liability",
    name: "Liability Insurance only Charge",
    detail: "State-minimum liability cover for the rental period.",
    pricePerHour: 4,
    pricePerDay: 25,
  },
  {
    id: "under-21",
    name: "Under 21",
    detail: "Young-driver surcharge for ages 18–20.",
    pricePerHour: 4,
    pricePerDay: 25,
  },
  {
    id: "under-25",
    name: "Under 25",
    detail: "Age 24–21",
    pricePerHour: 3,
    pricePerDay: 15,
  },
];

export function getAddonById(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}
