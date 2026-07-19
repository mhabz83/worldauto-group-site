"use server";

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: { name?: string; email?: string; message?: string };
};

/* Handles a contact submission: validates the input, filters obvious bots,
 * then emails the enquiry to the group office through Resend.
 *
 * Required environment variables (add in Vercel → Project → Settings →
 * Environment Variables, or a local .env.local):
 *   RESEND_API_KEY    — API key from resend.com
 *   CONTACT_TO_EMAIL  — inbox that receives enquiries (see PLACEHOLDERS.md #4)
 * Optional:
 *   CONTACT_FROM_EMAIL — verified sender, e.g. "WorldAuto Group <no-reply@wag-me.com>".
 *                        Defaults to Resend's onboarding sender, which only
 *                        delivers to the Resend account owner's own address.
 *
 * Until both required variables are set, the form tells the visitor the
 * message could not be sent (it never pretends a message was delivered).
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_FIELD = 200;
const MAX_MESSAGE = 5000;

const FAILURE_MESSAGE =
  "We could not send your message just now. Please try again in a few minutes.";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim().slice(0, MAX_FIELD);
  const org = String(formData.get("org") ?? "").trim().slice(0, MAX_FIELD);
  const vertical = String(formData.get("vertical") ?? "").trim().slice(0, MAX_FIELD);
  const email = String(formData.get("email") ?? "").trim().slice(0, MAX_FIELD);
  const message = String(formData.get("message") ?? "")
    .trim()
    .slice(0, MAX_MESSAGE);
  // Honeypot: real visitors never see or fill this field. Bots that fill it
  // get a normal-looking confirmation and nothing is sent.
  const trap = String(formData.get("company_website") ?? "").trim();

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Please add a short message.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  const successState: ContactState = {
    ok: true,
    message:
      "Thank you. Your enquiry has been received and the group office will be in touch.",
  };

  if (trap.length > 0) {
    return successState;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "WorldAuto Group <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    console.error(
      "[contact] Delivery not configured: missing " +
        [!apiKey && "RESEND_API_KEY", !toEmail && "CONTACT_TO_EMAIL"]
          .filter(Boolean)
          .join(" and "),
    );
    return { ok: false, message: FAILURE_MESSAGE };
  }

  const lines = [
    `Name: ${name}`,
    org ? `Company: ${org}` : null,
    vertical ? `Reaching out as: ${vertical}` : null,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].filter((line): line is string => line !== null);

  const html = `
    <h2 style="margin:0 0 16px">New website enquiry</h2>
    <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
    ${org ? `<p style="margin:0 0 4px"><strong>Company:</strong> ${escapeHtml(org)}</p>` : ""}
    ${vertical ? `<p style="margin:0 0 4px"><strong>Reaching out as:</strong> ${escapeHtml(vertical)}</p>` : ""}
    <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="margin:0 0 4px"><strong>Message:</strong></p>
    <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Website enquiry from ${name}${org ? ` (${org})` : ""}${vertical ? ` — ${vertical}` : ""}`,
        text: lines.join("\n"),
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[contact] Resend rejected the send (${response.status}): ${detail}`,
      );
      return { ok: false, message: FAILURE_MESSAGE };
    }
  } catch (error) {
    console.error("[contact] Could not reach the email service:", error);
    return { ok: false, message: FAILURE_MESSAGE };
  }

  return successState;
}
