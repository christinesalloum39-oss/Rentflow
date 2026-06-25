# RentFlow — Modular Car-Rental Booking (Next.js)

A five-step rental booking flow modelled on the apprentall / Discount Rent A Car
reference, built with **Next.js 15 (App Router) + TypeScript + Tailwind** as
**feature modules**. Each step owns its components, logic, types, and mock data
and exposes a small `index.ts` barrel; one `booking` orchestrator holds the
wizard state and the live, tax-inclusive quote.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /book
```

## The flow (matches the reference screens)

1. **Search** — Book Now: location, "different drop-off" toggle, From/To
   date + time, age, promo code → Search.
2. **Fleet** — vehicle results: cards with price/day, total, refundable deposit,
   doors/seats/baggage, "instant booking", "N left" → Book Now.
3. **Add-ons** — selectable add-ons (liability, age charges) with a live
   **Rental Details** panel: rate + extras + taxes & fees.
4. **Terms** — scrollable terms + acceptance checkbox gate → Accept.
5. **Contact** — contact info, driver's licence, optional additional driver,
   address → Finish → confirmation.

## Module map

```
src/modules/
  booking/   ← orchestrator: reducer + context, pricing, wizard, shared panels
    lib/pricing.ts          computeQuote(): rate + per-day extras + tax/OCF/VLF
    components/             booking-wizard · rental-details · trip-bar · step-footer
    types.ts                BookingState, SearchParams, ContactDetails, Quote …
  search/    ← Step 1 · locations, age + time options, Book Now form
  fleet/     ← Step 2 · vehicle catalog + result cards
  addons/    ← Step 3 · add-on catalog + selection
  terms/     ← Step 4 · terms copy + acceptance
  contact/   ← Step 5 · contact / licence / additional driver / address
  shared/    ← Button, Field, Input, Select, Toggle, SectionCard, money/date utils
```

## How the modules connect

- **One source of truth.** `booking/context` holds the whole draft; steps read /
  write slices via `useBooking()`. No step imports another step.
- **The orchestrator is the only thing that knows every step** — a single
  `StepId → component` map in `booking-wizard.tsx`. Reorder or add steps there
  plus in `STEP_ORDER` (`booking/types.ts`).
- **Pricing is pure.** `computeQuote()` reproduces the reference receipt exactly:
  `salesTax = 7.45% × (rate + extras)`, `+ $4 OCF + $4 VLF`. The $200 van for
  1 day with two $25 add-ons → **$276.63**. Adjust rates in `booking/lib/pricing.ts`.
- **No import cycles.** Steps import the booking context/components by their file
  paths; pricing deep-imports the data libs (not component barrels).

## Rebrand to Novaride (one place)

The whole palette is theme tokens in `tailwind.config.ts`. To switch from the
reference magenta to Novaride's identity, change `brand` to your gold and swap
the Poppins display font in `app/layout.tsx` for Oswald — nothing else changes.

```ts
brand: { DEFAULT: "#B68A4E", dark: "#9C7438", light: "#E4D2AC" }, // Novaride gold
```

## Swapping mock data for an API

`VEHICLES`, `LOCATIONS`, `ADDONS` each sit behind a lookup function, so call
sites never change. Replace the arrays with `fetch` results (availability,
real pricing, a `POST /bookings` on Finish) and keep the `Vehicle` / `Location`
/ `Addon` shapes.


## Vehicle photos

Cards show real car photos via `vehicle.image` (`fleet/lib/vehicles.ts`). The
defaults pull real photos from loremflickr so it works out of the box; swap them
for your own licensed photos in `public/cars/` (see `public/cars/README.md`).
A failed image gracefully falls back to a car icon.

## Notes

- Type-checked clean (`npx tsc --noEmit`).
- Step gating lives in `canAdvanceFrom()` in the context.
- All interactive pieces are client components; pages stay server components.
- Terms copy is generic placeholder text — replace with your real agreement.
