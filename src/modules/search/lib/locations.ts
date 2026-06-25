export type Location = {
  id: string;
  name: string;
  address: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "beirut",
    name: "Beirut",
    address: "Hamra Street, Beirut, Lebanon",
  },
  {
    id: "tripoli",
    name: "Tripoli",
    address: "Azmi Street, Tripoli, Lebanon",
  },
  {
    id: "zahle",
    name: "Zahlé",
    address: "Boulevard, Zahlé, Bekaa, Lebanon",
  },
];

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

export const AGE_OPTIONS = ["18–20", "21–24", "25+"];

export const TIME_OPTIONS = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const ampm = h < 12 ? "AM" : "PM";
      const hr = h % 12 === 0 ? 12 : h % 12;
      out.push(`${String(hr).padStart(2, "0")}:${m === 0 ? "00" : "30"} ${ampm}`);
    }
  }
  return out;
})();
