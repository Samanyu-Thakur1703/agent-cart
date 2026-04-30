# AgentCart

The AI shopping agent that browses, decides, and pays — so your users never touch a checkout form again.

## Features

- **Conversational AI Shopping** - Type what you want, AI finds the best options
- **OpenRouter Free Models** - Zero cost AI via `openrouter/free` router
- **Locus Checkout Integration** - One-click USDC payments via Locus wallet
- **Spending Guardrails** - Set transaction and daily spending limits
- **Purchase History** - Full audit trail with receipts

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **AI**: OpenRouter (free tier models)
- **Payments**: CheckoutWithLocus SDK
- **Database**: SQLite (better-sqlite3)

## Setup

1. Clone and install:
```bash
git clone <repo-url>
cd agent-cart
npm install
```

2. Add environment variables to `.env.local`:
```
OPENROUTER_API_KEY=sk-or-v1-your_key_here
LOCUS_API_KEY=claw_dev_your_key_here
LOCUS_API_BASE_URL=https://beta-api.paywithlocus.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run dev server:
```bash
npm run dev
```

4. Open `http://localhost:3000`

## Usage

1. Type a shopping request: *"Buy me a USB-C hub under $30"*
2. AI returns 3 ranked product options with reasoning
3. Click "Buy with Locus" on your preferred option
4. Complete payment via Locus Checkout
5. View receipt and purchase history

## Environment Notes

- Locus API key must be from beta environment (use code `PAYGENTIC` at beta.paywithlocus.com)
- OpenRouter key from https://openrouter.ai (free tier works)
- Locus wallet needs USDC on Base for payments

## Deploy

```bash
git init
git add .
git commit -m "Initial AgentCart MVP"
# Push to GitHub, then connect to Vercel
```

## Hackathon Submission

Built for Locus Hackathon 2026 - showcasing agentic commerce with CheckoutWithLocus.
