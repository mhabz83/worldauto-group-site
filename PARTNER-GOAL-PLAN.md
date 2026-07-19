# Partner-Conversion Plan of Record

**Goal (owner-stated):** any partner — fuel retailer, insurer, bank, or automotive —
views the site and feels compelled to reach out. Every angle: design, content, etc.

## Status by angle (as of 2026-07-19)

| # | Angle | Status | Notes |
|---|-------|--------|-------|
| 1 | Design pull (hero, cinematic plates, flush sections) | DONE | Neon SUV hero, generated DNA plate, no boxed elements |
| 2 | Credibility (verified numbers, client logos, real team) | DONE | ~$650M / ~4,000 / since 1994 (owner-approved); AutoData client marquee |
| 3 | Vertical relevance | DONE | "One platform, four doors in": fuel retail / insurance / banking / automotive, each with claim + proof |
| 4 | Persuasion at the close | DONE | Heritage / Scale / Team / Innovation → what each unlocks → single CTA |
| 5 | Product story | DONE | Express Fit named in the quick-service pillar |
| 6 | Lead quality | DONE | "I'm reaching out as" vertical selector, threaded into the enquiry email |
| 7 | Mobile | VERIFIED | No overflow on any new section (390px) |
| 8 | Shared-link first impression | DONE | Branded OG/Twitter card live (`/og.jpg`) |
| 9 | Team-page accuracy | CLOSED | Owner decision: site roster/titles are the source of truth |
| 10 | **Reach-out loop (form delivery)** | **BLOCKED — owner input** | Code complete; requires `RESEND_API_KEY` + `CONTACT_TO_EMAIL` secrets |

## The one open item (10): activation steps

Owner does once (~5 minutes):
1. Create a free account at resend.com (100 emails/day free — ample for enquiries).
2. Dashboard → **API Keys** → *Create API Key* (Full access) → copy the `re_...` value.
3. (Recommended) Dashboard → **Domains** → *Add domain* → `worldauto.group` → Resend
   shows 2–3 DNS records → add them in Cloudflare DNS (2 minutes) so mail sends from
   `enquiries@worldauto.group` instead of Resend's onboarding sender.
4. Hand over: the API key + the inbox that should receive partner enquiries.

Then (done for you, ~10 minutes):
- Store both as encrypted Worker secrets (never in code or git).
- Submit a real test enquiry through the live form; confirm receipt in the inbox.
- Optionally print the public email on /contact and the partner close.

## Explicitly out of scope (owner decisions on file)

- No ADNOC or pending-deal references anywhere on the site.
- Team roster/titles stay as-is (site is source of truth over the corporate deck).
- Revenue/headcount figures approved for public display.
- Hero subtext length left as-is.
- Mixed suit colours in team portraits accepted.
- Investor-grade metrics (e.g. 1,350% ROI) deliberately kept off the public site.

## Change control

Nothing further ships against this goal without an amendment to this plan agreed
with the owner first.
