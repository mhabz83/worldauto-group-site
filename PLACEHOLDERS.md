# PLACEHOLDERS — items awaiting owner confirmation

Nothing below is invented on the site. Where a fact is missing, the copy
stays structural or the field is left empty.

| # | Item | Where it lives | Status |
|---|------|----------------|--------|
| 1 | [TO CONFIRM: Quick Service Plug and Play positioning copy from owner] | `content/home.ts` → `model.pillars[0].body` (structural copy in place, no client or negotiation named) | Awaiting owner wording |
| 2 | [TO CONFIRM: other public milestones] for the heritage timeline | `content/home.ts` → `heritage.rows` (currently 1994 / 1990s / 2004 / today) | Awaiting owner list |
| 3 | [TO CONFIRM: exact founding year of Phaeton Auto Group] | `content/home.ts` → heritage row shows "1990s" ("more than 30 years ago" is the verified phrasing) | Awaiting owner confirmation |
| 4 | [TO CONFIRM: public contact email] | `content/home.ts` → `ctaBand.cta.href` (mailto left blank; button renders but is inert) | Awaiting owner email |
| 5 | [TO CONFIRM: legal entity name] for footer privacy note | `content/site.ts` → `footer.legal` (currently generic group name) | Awaiting owner confirmation |
| 6 | Public leaders | `content/site.ts` → `leaders`; Leadership section on `/about`. Owner-confirmed: Amin Kadrie (Chairman), Khalid Kadrie (CEO), Alexander Maas (CFO), Raymond Zhu (CTO). | DONE — bios/photos optional, owner may add self |
| 8 | Contact form action | `app/contact/actions.ts` validates + confirms but does NOT deliver (no email backend; needs #4) | Built, delivery still to wire |
| 7 | Pillar copy for Data & Software / Automotive FinTech / Consulting & Training | `content/home.ts` → `model.pillars[1..3]` — kept to one abstract line each, derived from verified company facts only | Owner may sharpen |
