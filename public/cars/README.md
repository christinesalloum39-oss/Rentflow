# Vehicle photos

The fleet cards render `vehicle.image` (see `src/modules/fleet/lib/vehicles.ts`).

By default each vehicle points at a real car photo from loremflickr (handy for
development). For production, use your own licensed photos:

1. Drop files here, e.g. `econoline-15.jpg`, `full-size-suv.jpg`, ...
2. In `vehicles.ts`, change each `image` to the local path, e.g.
   `image: "/cars/econoline-15.jpg"`.

Recommended free, no-attribution sources for car photos: Unsplash, Pexels.
If a photo ever fails to load, the card falls back to a simple car icon, so it
never looks broken.

Tip: to use `next/image` instead of a plain `<img>`, add the remote host to
`images.remotePatterns` in `next.config.mjs` (not needed for local /cars files).
