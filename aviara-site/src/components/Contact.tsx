"use client";

import { useState, FormEvent } from "react";
import Reveal from "./Reveal";
import { site } from "@/data/site";

const projectTypes = [
  "Vacant Staging",
  "Occupied Staging",
  "Interior Design",
  "Not sure yet",
];

const roomOptions = [
  "Living Room",
  "Dining Room",
  "Kitchen",
  "Primary Bedroom",
  "Secondary Bedrooms",
  "Office",
  "Bathrooms",
  "Outdoor",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
  }

  return (
    <section id="contact" className="section relative bg-ivory border-t border-line overflow-hidden">
      <div
        aria-hidden="true"
        className="watermark -bottom-8 -left-12 hidden lg:block"
        style={{ fontSize: "clamp(10rem, 22vw, 22rem)", opacity: 0.05 }}
      >
        Begin
      </div>

      <div className="container-wide relative z-10 grid lg:grid-cols-12 gap-12 items-start">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-3">
            <span className="gold-rule" /> {site.sections.contact.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-ink">
            {site.sections.contact.headlineLine1}
            <span className="italic text-brass"> {site.sections.contact.headlineItalic}</span>
          </h2>
          <p className="mt-6 text-lg text-mute leading-relaxed">
            {site.sections.contact.intro}
          </p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="eyebrow">Phone</dt>
              <dd className="mt-2">
                <a
                  href={`tel:${site.phoneTel}`}
                  className="font-display text-2xl text-ink hover:text-brass transition-colors"
                  data-testid="contact-phone"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${site.email}`}
                  className="font-display text-2xl text-ink hover:text-brass transition-colors break-all"
                  data-testid="contact-email"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Studio</dt>
              <dd className="mt-2 text-base text-slate">
                {site.address.city}, {site.address.region}
                <br />
                <span className="text-sm text-mute">
                  Serving {site.serviceAreas.slice(0, 3).join(", ")} & all of Southern California
                </span>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Hours</dt>
              <dd className="mt-2 text-sm text-mute space-y-1">
                {site.hours.map((h) => (
                  <div key={h.day}>
                    <span className="text-slate font-medium">{h.day}: </span>
                    {h.time}
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="bg-bone border border-line p-7 md:p-10"
            aria-label="Project inquiry form"
            data-testid="contact-form"
          >
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
              <Field id="name" label="Your Name" required />
              <Field id="email" label="Email" type="email" required />
              <Field id="phone" label="Phone" type="tel" />
              <SelectField id="projectType" label="Project Type" options={projectTypes} required />
              <Field id="city" label="Property City" />
              <Field id="squareFootage" label="Square Footage" type="number" placeholder="e.g. 2,400" />
              <Field id="stagingDate" label="Desired Staging Date" type="date" full />
              <CheckboxGroup id="rooms" label="Rooms to Stage" options={roomOptions} />
              <TextAreaField id="message" label="Tell us about your project" full />
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-between gap-5">
              <p className="text-xs text-mute max-w-xs">
                By submitting, you consent to be contacted about your project. We
                never share your information.
              </p>
              <button type="submit" className="btn btn-ink" data-testid="contact-submit">
                Send Inquiry
              </button>
            </div>

            {submitted && (
              <p
                role="status"
                className="mt-6 text-sm text-brass border-t border-line pt-5"
                data-testid="contact-success"
              >
                Thank you. Your inquiry is in and we'll reach out within one business day.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
};

function Field({ id, label, type = "text", required, full, placeholder }: FieldProps) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="block text-[0.7rem] uppercase tracking-widest text-mute font-medium"
      >
        {label}
        {required && <span className="text-brass ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-0 border-b border-line py-2.5 text-base text-ink placeholder-mute/70 focus:outline-none focus:border-brass transition-colors"
      />
    </div>
  );
}

function CheckboxGroup({
  id,
  label,
  options,
}: {
  id: string;
  label: string;
  options: string[];
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="block text-[0.7rem] uppercase tracking-widest text-mute font-medium">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2" data-testid={`group-${id}`}>
        {options.map((opt) => (
          <label
            key={opt}
            className="group inline-flex items-center cursor-pointer select-none"
          >
            <input
              type="checkbox"
              name={id}
              value={opt}
              className="peer sr-only"
            />
            <span
              className="px-3.5 py-2 text-sm text-slate border border-line bg-transparent transition-colors peer-checked:bg-ink peer-checked:text-ivory peer-checked:border-ink hover:border-brass peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brass"
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TextAreaField({ id, label, full }: FieldProps) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="block text-[0.7rem] uppercase tracking-widest text-mute font-medium"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={4}
        className="mt-2 w-full bg-transparent border-0 border-b border-line py-2.5 text-base text-ink placeholder-mute focus:outline-none focus:border-brass transition-colors resize-none"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  required,
  full,
}: FieldProps & { options: string[] }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="block text-[0.7rem] uppercase tracking-widest text-mute font-medium"
      >
        {label}
        {required && <span className="text-brass ml-1">*</span>}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        defaultValue=""
        className="mt-2 w-full bg-transparent border-0 border-b border-line py-2.5 text-base text-ink focus:outline-none focus:border-brass transition-colors"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
