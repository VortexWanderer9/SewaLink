# SewaLink Nepal — Web App (Prototype)

A working Next.js prototype of the SewaLink Nepal customer web experience:
landing page, service browsing/search, worker profiles, and a full booking flow.
Built with mock data — no backend yet — so it's ready to click through with
investors or user-test, and ready to wire up to the real API described in the
architecture doc.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with a custom design system (see `tailwind.config.ts`)
- **lucide-react** for icons
- `next/font/google`: Sora (display), Inter (body/UI), IBM Plex Mono (data), Noto Sans Devanagari (Nepali script)

## Getting started
```bash
npm install
npm run dev
```
Then open http://localhost:3000

## Pages
| Route | Purpose |
|---|---|
| `/` | Landing page — hero, categories, how it works, business/pro CTAs, testimonials, FAQ, investor section |
| `/browse` | Search & filter verified professionals by category, name, or area |
| `/worker/[id]` | Worker profile — bio, verification checklist, reviews, booking CTA |
| `/booking/[workerId]` | 4-step booking flow — address, time slot, payment, review |
| `/booking/confirmed` | Confirmation screen with chat/track shortcuts |

## Design system
- **Colors:** deep indigo (trust/primary), marigold (accent/CTA, echoes Tihar flower garlands), sage (verified/success), paper (warm off-white backgrounds), brick (used sparingly for business-facing content).
- **Signature motif:** a hand-stamped "verified" ink seal (`components/VerifiedStamp.tsx`), styled after the stamps used on Nepali citizenship documents and ward letters — a direct visual echo of the actual verification process the product is built on.
- **Data:** `lib/data.ts` holds mock categories, workers, and testimonials. Swap this for real API calls once the NestJS backend (see the architecture doc) is live — component props are already typed to make that swap straightforward.

## Next steps to wire up the real backend
1. Replace `lib/data.ts` reads with API calls to the NestJS services (`/bookings`, `/workers`, `/categories`).
2. Add auth (phone OTP) — currently the "Log in" button is a placeholder.
3. Add Socket.io client for live tracking on the confirmation page.
4. Add real payment gateway SDKs (eSewa/Khalti/IME Pay) at the payment step in the booking flow.
