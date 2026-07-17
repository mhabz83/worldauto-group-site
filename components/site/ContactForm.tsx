"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/contact/actions";

const initial: ContactState = { ok: false, message: "" };

const fieldClass =
  "mt-2 w-full rounded-[4px] border border-hairline bg-[rgba(2,4,15,0.72)] px-4 py-3 text-hi placeholder:text-faint focus:border-[var(--highlight)] focus:outline-none";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="rounded-[4px] border border-hairline bg-[rgba(2,4,15,0.72)] p-8">
        <p className="type-kicker text-highlight">Message received</p>
        <p className="mt-4 text-lg leading-relaxed text-hi">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="type-kicker text-mid">Name</span>
          <input name="name" type="text" autoComplete="name" className={fieldClass} placeholder="Your name" />
          {state.errors?.name && (
            <span className="mt-2 block type-mono text-highlight">{state.errors.name}</span>
          )}
        </label>
        <label className="block">
          <span className="type-kicker text-mid">Company</span>
          <input name="org" type="text" autoComplete="organization" className={fieldClass} placeholder="Company or organisation" />
        </label>
      </div>

      <label className="block">
        <span className="type-kicker text-mid">Email</span>
        <input name="email" type="email" autoComplete="email" className={fieldClass} placeholder="you@company.com" />
        {state.errors?.email && (
          <span className="mt-2 block type-mono text-highlight">{state.errors.email}</span>
        )}
      </label>

      <label className="block">
        <span className="type-kicker text-mid">Message</span>
        <textarea name="message" rows={5} className={fieldClass} placeholder="How can the group help?" />
        {state.errors?.message && (
          <span className="mt-2 block type-mono text-highlight">{state.errors.message}</span>
        )}
      </label>

      {state.message && !state.ok && (
        <p className="type-mono text-highlight">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-[4px] bg-highlight px-7 py-4 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
