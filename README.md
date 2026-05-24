# altr_mvp

> **Where live deals get done.**  
> Sponsorship infrastructure connecting K-brands and Live Stages across APAC & GCC.

---

## What is ALTR?

Live events generate $200B+ annually. Sponsorship funds 35% of every event — yet the market is broken: too many events chasing too few sponsors, no settlement infrastructure, and no way to measure what works.

**ALTR fixes the imbalance** by expanding who can sponsor, how deals are settled, and what ROI looks like — starting with the fastest-growing content export in the world: **K-brands.**

> Traditional sponsorship sells exposure. ALTR sells outcomes — real transactions, real-time.

---

## The Problem

### Gap 1 — The Imbalance
Sponsorship market is structurally **more supply (events), less demand (sponsors)**. 100+ festivals canceled in 2025. Events are competing for the same limited pool of brands. No platform has tried to expand the demand side.

### Gap 2 — The ROI Trust Gap
Sponsors demand ROI but tools don't deliver trust. Data depends on event self-reporting (conflict of interest). ROI tools like SponsorUnited and Zoomph answer *"did it work?"* — backward-looking. Nobody answers *"what should I buy next?"*

### Gap 3 — Settlement Is Structurally Broken
Live event sponsorship has 5 layers of complexity standard payment rails can't handle:
- **Time axis** — pre-event deposit, event-day, post-event performance tranches
- **Conditional refunds** — tiered forfeit schedules tied to cancellation timing
- **Bidirectional revenue share** — monthly RS in both directions, up to 18% consumed by SWIFT fees
- **Velocity = survival** — a 5-day late payment can cancel an entire event
- **3-party cross-border default** — KRW → AED/SAR → USD across 3 jurisdictions

---

## The Solution

**ALTR is the AI agent that executes sponsorship deals end-to-end** — from match to settlement.

### The 3-Layer Stack

| Layer | What it does |
|---|---|
| **Trust Layer** | Curated waitlist of K-brands + Right Holders. Quality-filtered. Every listing vetted. |
| **Intelligence Layer** | Pre-deal: narrows the right stage per K-brand. Post-deal: POS data → cross-stage benchmarks → smarter next match. |
| **Finance Layer** | Programmable settlement. Milestone-triggered. Real-time RS auto-split. |

### The 6-Step Deal Flow

```
INTELLIGENCE(pre) → MATCH → CONTRACT → [EXECUTE: Right Holder] → SETTLE → INTELLIGENCE(post) → ♻️
```

1. **Narrow Down** — Agent identifies which Right Holders match K-brand's vertical, region, budget
2. **Find Your Stage** — Top matches surfaced. Golden Match invitation sent.
3. **Agree + Sign** — Deal terms auto-generated. Milestones defined = settlement triggers.
4. **Execute** *(Right Holder zone)* — Booth setup, on-site ops. ALTR tracks, not executes.
5. **Settle** — POS API → real-time sales → RS auto-split → settlement. 3 seconds, <1% fee.
6. **Benchmark** — Results feed the intelligence layer. Next match is smarter.

---

## Who It's For

**Sellers — Right Holders (Live Stage Properties)**
- Festivals, conferences, expos, fashion weeks
- Hospitality / mall pop-up spaces with existing audiences

**Buyers — Brands**
- **Sponsors** — capital infusion (traditional model)
- **Content Partners** — K-beauty, K-food, K-fashion, K-content IP entering new markets via live stages (revenue share / activation-based)

---

## The Moat

| Moat | Description |
|---|---|
| **Distribution** | Korea K-brand founder network + GCC Right Holder relationships. No US/EU platform can build this. |
| **Pre-Deal Intelligence** | Audience fit + ROI estimation + budget simulation before a single contract is signed. Gets sharper with every deal. |
| **Switching Cost** | K-brands accumulate deal history on ALTR. Right Holders accumulate RS settlement records. Leaving means starting over. |
| **Data Loop** | POS API → RS auto-calculated → settled → feeds back into intelligence. The rail trains the matching agent. |

```
Distribution → first deals → Pre-Deal Intelligence → better matches → Switching Cost → lock-in → Data Loop → smarter agent → ♻️
```

---

## Market

| Metric | Value |
|---|---|
| Global live entertainment market (2025) | $203B |
| Global sponsorship spending | $100B+ |
| Average event revenue from sponsorship | 35% |
| Sponsorship CAGR → 2033 | 9.2% → $130B+ |

---

## Revenue Model

| Tier | Price | For |
|---|---|---|
| Starter | $49/mo | Basic marketplace access. Event organizers + SMB brands. |
| Pro | $99/mo | Full matching intelligence + ROI dashboard + priority placement. |
| Transaction | % per deal | Commission on deals settled through ALTR. Capital + RS deals. |

---

## Roadmap

| Phase | Timeline | What |
|---|---|---|
| **Phase 0** | Now | Waitlist — K-brands + overseas stages. Quality-filtered applications. |
| **Phase 1A** | Month 1→9 | Affiliate-model consulting. Revenue from Day 1. Manual reporting. Trust layer. |
| **Phase 1B** | Month 9→18 | SaaS tiers + POS integration + GCC market entry (Saudi Vision 2030). |
| **Phase 2→3** | 18M+ | Full marketplace + settlement rail + benchmark intelligence at scale. |

---

## This Repo — Pre-MVP / Demo Skeleton

`altr_mvp` is the **pre-MVP skeleton** for `demo.altr.haus`.

### What this means
- All data is **mock** — no real DB connections yet
- API routes are **structured for real swap** — mock returns today, real API tomorrow
- Every component is built **production-ready** — not throwaway
- Goal: **investor demo NOW → real product LATER** (switch, not rewrite)

### Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **shadcn/ui**

### Structure
```
altr_mvp/
├── app/
│   ├── page.tsx              # Investor landing (one-pager)
│   ├── onboard/
│   │   ├── page.tsx          # Role selection: K-Brand | Right Holder
│   │   ├── brand/            # K-Brand onboarding flow
│   │   └── stage/            # Right Holder onboarding flow
│   └── demo/
│       └── [dealId]/         # Deal simulation
├── components/               # Shared UI components
├── lib/
│   ├── mock-data.ts          # All mock data here — swap to real API later
│   └── types.ts              # TypeScript types: Deal, Brand, Stage, Milestone
└── AGENTS.md                 # Claude Code context
```

### Key Rule
> **Never hardcode values in components. All data lives in `/lib/mock-data.ts`.**  
> When the real API is ready — swap `mock-data.ts`. Components stay untouched.

---

## Deploy

```bash
npm install
npm run dev
```

Deployed at → **[demo.altr.haus](https://demo.altr.haus)**  
Previous XRP version → [altr-sponsorship-mvp.vercel.app](https://altr-sponsorship-mvp.vercel.app)

---

## Contact

- Twitter: [@altr2026](https://twitter.com/altr2026)
- LinkedIn: [linkedin.com/company/altr2026](https://linkedin.com/company/altr2026)
- Email: hello@altr.haus

---

*ALTR · Sponsorship Infrastructure for the Live Economy · 2026 · Confidential*
