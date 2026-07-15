"use server";

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: { name?: string; email?: string; message?: string };
};

/* Validates a contact submission.
 *
 * DELIVERY IS NOT WIRED YET. There is no email/CRM backend configured, and the
 * group's public contact address is still a placeholder (see PLACEHOLDERS.md #4/#8).
 * This action validates the input and returns a confirmation, but does NOT send or
 * persist anything. Handoff task: connect this to the group inbox or a form service
 * (e.g. Resend, Formspree) once the address is provided.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Please add a short message.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  return {
    ok: true,
    message:
      "Thank you. Your enquiry has been received and the group office will be in touch.",
  };
}
