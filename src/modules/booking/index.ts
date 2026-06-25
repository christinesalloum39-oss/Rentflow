export { BookingWizard } from "./components/booking-wizard";
export { BookingProvider, useBooking } from "./context/booking-context";
export { RentalDetails } from "./components/rental-details";
export { TripBar } from "./components/trip-bar";
export { StepFooter } from "./components/step-footer";
export { computeQuote, TAX_CONFIG } from "./lib/pricing";
export {
  STEP_ORDER,
  STEP_LABELS,
  type BookingState,
  type SearchParams,
  type ContactDetails,
  type Person,
  type StepId,
  type Quote,
  type QuoteLine,
} from "./types";
