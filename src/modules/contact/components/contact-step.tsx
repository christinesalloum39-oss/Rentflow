"use client";

import { useState } from "react";
import { useBooking } from "../../booking/context/booking-context";
import { RentalDetails } from "../../booking/components/rental-details";
import { TripBar } from "../../booking/components/trip-bar";
import type { Person } from "../../booking/types";
import { Button, Collapsible, Field, Input, money, Toggle } from "../../shared";

type SectionKey = "contact" | "license" | "additional" | "address";

const blankPerson = (): Person => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  licenseNo: "",
  licenseExpiry: "",
  licenseIssue: "",
});

export function ContactStep() {
  const { state, quote, patchContact, back, reset } = useBooking();
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    contact: true,
    license: false,
    additional: false,
    address: false,
  });
  const c = state.contact;

  const toggle = (k: SectionKey) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const setDriver = (patch: Partial<Person>) =>
    patchContact({ driver: { ...c.driver, ...patch } });
  const setAdditionalAt = (i: number, patch: Partial<Person>) =>
    patchContact({
      additional: c.additional.map((d, idx) => (idx === i ? { ...d, ...patch } : d)),
    });
  const addAdditional = () =>
    patchContact({ additional: [...c.additional, blankPerson()] });
  const removeAdditional = (i: number) => {
    const next = c.additional.filter((_, idx) => idx !== i);
    patchContact({ additional: next, hasAdditional: next.length > 0 });
  };
  const setAddress = (patch: Partial<typeof c.address>) =>
    patchContact({ address: { ...c.address, ...patch } });

  const contactComplete = Boolean(
    c.driver.firstName && c.driver.lastName && c.driver.email && c.driver.phone,
  );
  const licenseComplete = Boolean(
    c.driver.dob && c.driver.licenseNo && c.driver.licenseExpiry,
  );
  const addressComplete = Boolean(c.address.line && c.address.city);

  const handleFinish = () => {
    // Required = contact info. If incomplete, reveal it instead of silently failing.
    if (!contactComplete) {
      setOpen((o) => ({ ...o, contact: true }));
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center shadow-card">
        <p className="text-4xl text-brand">✓</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">
          Booking confirmed
        </h2>
        <p className="mt-2 text-sm text-body">
          Thanks, {c.driver.firstName}. A confirmation for{" "}
          {money(quote.estimatedTotal)} is on its way to {c.driver.email}.
        </p>
        <Button variant="outline" className="mt-5" onClick={reset}>
          Start a new booking
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TripBar />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Collapsible
            title="Contact Info"
            open={open.contact}
            onToggle={() => toggle("contact")}
            complete={contactComplete}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First Name">
                <Input
                  value={c.driver.firstName}
                  placeholder="Enter First Name"
                  onChange={(e) => setDriver({ firstName: e.target.value })}
                />
              </Field>
              <Field label="Last Name">
                <Input
                  value={c.driver.lastName}
                  placeholder="Enter Last Name"
                  onChange={(e) => setDriver({ lastName: e.target.value })}
                />
              </Field>
              <Field label="Phone Number">
                <Input
                  value={c.driver.phone}
                  placeholder="Enter Phone Number"
                  onChange={(e) => setDriver({ phone: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={c.driver.email}
                  placeholder="Enter Email"
                  onChange={(e) => setDriver({ email: e.target.value })}
                />
              </Field>
            </div>
          </Collapsible>

          <Collapsible
            title="Driver's License Info"
            open={open.license}
            onToggle={() => toggle("license")}
            complete={licenseComplete}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date of Birth">
                <Input
                  type="date"
                  value={c.driver.dob}
                  onChange={(e) => setDriver({ dob: e.target.value })}
                />
              </Field>
              <Field label="Driver's License Number">
                <Input
                  value={c.driver.licenseNo}
                  placeholder="Driver's License Number"
                  onChange={(e) => setDriver({ licenseNo: e.target.value })}
                />
              </Field>
              <Field label="Driver's License Expiry Date">
                <Input
                  type="date"
                  value={c.driver.licenseExpiry}
                  onChange={(e) => setDriver({ licenseExpiry: e.target.value })}
                />
              </Field>
            </div>
          </Collapsible>

          <Collapsible
            title="Additional Driver Info"
            optional
            open={open.additional}
            onToggle={() => toggle("additional")}
            right={
              <Toggle
                on={c.hasAdditional}
                label="Add an additional driver"
                onChange={(v) => {
                  patchContact({
                    hasAdditional: v,
                    additional:
                      v && c.additional.length === 0
                        ? [blankPerson()]
                        : c.additional,
                  });
                  if (v) setOpen((o) => ({ ...o, additional: true }));
                }}
              />
            }
          >
            {c.hasAdditional ? (
              <div className="space-y-5">
                {c.additional.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-line bg-panel/40 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Driver {i + 1}
                      </p>
                      {i > 0 ? (
                        <button
                          type="button"
                          onClick={() => removeAdditional(i)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-2.5 py-1 text-xs font-semibold text-body transition-colors hover:border-red-300 hover:text-red-600"
                        >
                          <i className="fa-solid fa-minus" aria-hidden />
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="First Name">
                        <Input
                          value={d.firstName}
                          placeholder="Driver's First Name"
                          onChange={(e) =>
                            setAdditionalAt(i, { firstName: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Last Name">
                        <Input
                          value={d.lastName}
                          placeholder="Driver's Last Name"
                          onChange={(e) =>
                            setAdditionalAt(i, { lastName: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Phone Number">
                        <Input
                          value={d.phone}
                          placeholder="Driver's Phone Number"
                          onChange={(e) =>
                            setAdditionalAt(i, { phone: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Email">
                        <Input
                          value={d.email}
                          placeholder="Driver's Email"
                          onChange={(e) =>
                            setAdditionalAt(i, { email: e.target.value })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAdditional}
                  className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/5"
                >
                  <i className="fa-solid fa-plus" aria-hidden />
                  Add another driver
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted">
                Toggle on to add one or more authorised drivers.
              </p>
            )}
          </Collapsible>

          <Collapsible
            title="Personal Address"
            open={open.address}
            onToggle={() => toggle("address")}
            complete={addressComplete}
          >
            <div className="grid gap-5">
              <Field label="Address">
                <Input
                  value={c.address.line}
                  placeholder="Enter Address"
                  onChange={(e) => setAddress({ line: e.target.value })}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="City">
                  <Input
                    value={c.address.city}
                    placeholder="Enter City"
                    onChange={(e) => setAddress({ city: e.target.value })}
                  />
                </Field>
                <Field label="ZIP / Postal Code">
                  <Input
                    value={c.address.zip}
                    placeholder="Enter ZIP"
                    onChange={(e) => setAddress({ zip: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          </Collapsible>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={back}>
              ‹ Previous
            </Button>
            <Button onClick={handleFinish}>Finish ›</Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <RentalDetails />
        </div>
      </div>
    </div>
  );
}
