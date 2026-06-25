export type Vehicle = {
  id: string;
  name: string;
  /** Photo URL — remote, or a local "/cars/<id>.jpg" you drop in /public/cars */
  image: string;
  similarTo: string;
  vClass: "Van" | "SUV" | "Sedan" | "Economy";
  doors: number;
  seats: number;
  baggage: number;
  dailyRate: number;
  deposit: number;
  distancePerDay: number; // miles included per day
  instantBooking: boolean;
  unitsLeft: number;
};
