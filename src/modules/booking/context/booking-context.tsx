"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { computeQuote } from "../lib/pricing";
import {
  STEP_ORDER,
  type BookingState,
  type ContactDetails,
  type Person,
  type Quote,
  type SearchParams,
  type StepId,
} from "../types";

const STORAGE_KEY = "rentflow.booking";

const emptyPerson: Person = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  licenseNo: "",
  licenseExpiry: "",
  licenseIssue: "",
};

const today = new Date();
const tomorrow = new Date(today.getTime() + 86_400_000);
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const initialState: BookingState = {
  step: "search",
  search: {
    pickupId: "beirut",
    differentDropoff: false,
    dropoffId: "beirut",
    fromDate: isoDate(today),
    fromTime: "09:00 AM",
    toDate: isoDate(tomorrow),
    toTime: "09:00 AM",
    age: "25+",
    promo: "",
  },
  vehicleId: null,
  addons: {},
  termsAccepted: false,
  contact: {
    driver: { ...emptyPerson },
    hasAdditional: false,
    additional: [],
    address: { line: "", city: "", zip: "" },
  },
};

type Action =
  | { type: "PATCH_SEARCH"; payload: Partial<SearchParams> }
  | { type: "SELECT_VEHICLE"; payload: string }
  | { type: "TOGGLE_ADDON"; payload: { id: string; on: boolean } }
  | { type: "SET_TERMS"; payload: boolean }
  | { type: "PATCH_CONTACT"; payload: Partial<ContactDetails> }
  | { type: "GOTO"; payload: StepId }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "HYDRATE"; payload: Partial<BookingState> }
  | { type: "RESET" };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "PATCH_SEARCH": {
      const search = { ...state.search, ...action.payload };
      if (!search.differentDropoff) search.dropoffId = search.pickupId;
      return { ...state, search };
    }
    case "SELECT_VEHICLE":
      return { ...state, vehicleId: action.payload };
    case "TOGGLE_ADDON":
      return {
        ...state,
        addons: { ...state.addons, [action.payload.id]: action.payload.on },
      };
    case "SET_TERMS":
      return { ...state, termsAccepted: action.payload };
    case "PATCH_CONTACT":
      return { ...state, contact: { ...state.contact, ...action.payload } };
    case "GOTO":
      return { ...state, step: action.payload };
    case "NEXT": {
      const i = STEP_ORDER.indexOf(state.step);
      return { ...state, step: STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)] };
    }
    case "BACK": {
      const i = STEP_ORDER.indexOf(state.step);
      return { ...state, step: STEP_ORDER[Math.max(i - 1, 0)] };
    }
    case "HYDRATE": {
      const next = { ...state, ...action.payload };
      // Migrate older saved bookings where `additional` was a single object.
      const add = next.contact?.additional as unknown;
      if (next.contact && !Array.isArray(add)) {
        next.contact = {
          ...next.contact,
          additional: add && typeof add === "object" ? [add as Person] : [],
        };
      }
      return next;
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function canAdvanceFrom(step: StepId, state: BookingState): boolean {
  switch (step) {
    case "search":
      return Boolean(state.search.fromDate && state.search.toDate);
    case "fleet":
      return Boolean(state.vehicleId);
    case "addons":
      return true;
    case "terms":
      return state.termsAccepted;
    case "contact": {
      const d = state.contact.driver;
      return Boolean(d.firstName && d.lastName && d.email && d.phone);
    }
    default:
      return false;
  }
}

type Ctx = {
  state: BookingState;
  quote: Quote;
  canAdvance: boolean;
  patchSearch: (p: Partial<SearchParams>) => void;
  selectVehicle: (id: string) => void;
  toggleAddon: (id: string, on: boolean) => void;
  setTerms: (v: boolean) => void;
  patchContact: (p: Partial<ContactDetails>) => void;
  goto: (s: StepId) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
};

const BookingContext = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load any saved booking from the browser (runs once, on the client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch {
      /* ignore corrupt/unavailable storage */
    }
  }, []);

  // Persist the booking to the browser whenever it changes — no backend needed.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be full or disabled */
    }
  }, [state]);

  const quote = useMemo(
    () =>
      computeQuote({
        vehicleId: state.vehicleId,
        addons: state.addons,
        fromDate: state.search.fromDate,
        toDate: state.search.toDate,
      }),
    [state.vehicleId, state.addons, state.search.fromDate, state.search.toDate],
  );

  const value: Ctx = useMemo(
    () => ({
      state,
      quote,
      canAdvance: canAdvanceFrom(state.step, state),
      patchSearch: (p) => dispatch({ type: "PATCH_SEARCH", payload: p }),
      selectVehicle: (id) => dispatch({ type: "SELECT_VEHICLE", payload: id }),
      toggleAddon: (id, on) => dispatch({ type: "TOGGLE_ADDON", payload: { id, on } }),
      setTerms: (v) => dispatch({ type: "SET_TERMS", payload: v }),
      patchContact: (p) => dispatch({ type: "PATCH_CONTACT", payload: p }),
      goto: (s) => dispatch({ type: "GOTO", payload: s }),
      next: () => dispatch({ type: "NEXT" }),
      back: () => dispatch({ type: "BACK" }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state, quote],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): Ctx {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>");
  return ctx;
}
