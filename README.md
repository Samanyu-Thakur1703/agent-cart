# 🛒 AgentCart

The AI shopping agent that browses, decides, and pays — so your users never touch a checkout form again.

## 🎯 Problem & Solution

**Problem:** E-commerce checkout is still built for humans in 2026 — multi-step forms, card inputs, and redirects that completely break AI agent workflows. When an AI agent tries to buy something on behalf of a user, it hits a wall: no programmatic checkout API, no agent-native payment method, no policy enforcement.

**Solution:** AgentCart is a conversational AI shopping agent that lets users describe what they want in plain language, then autonomously browses products, compares options, and completes checkout — all powered by CheckoutWithLocus for payment and OpenRouter free models for reasoning.

## ✨ Features

### P0 Core Features (Implemented)
- ✅ **Conversational AI Shopping** - Type "buy me a USB-C hub under $30" and get 3 ranked options with reasoning
- ✅ **One-Tap Locus Checkout** - After user approves, agent creates Locus checkout session and completes payment via USDC wallet
- ✅ **Spending Policy Guardrails** - Set max per transaction ($100 default) and per day ($500 default) limits
- ✅ **Purchase History + Audit Trail** - Every transaction logged with product, price, reasoning, and receipt ID
- ✅ **Zero AI Cost** - Uses OpenRouter free model router (`openrouter/free`)

### P1 Features (Planned)
- 🔄 Recurring purchase mode ("Reorder my coffee every 3 weeks")

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS |
| **AI Layer** | OpenRouter (`openrouter/free` model router) |
| **Payments** | CheckoutWithLocus SDK (`@withlocus/checkout-react`) |
| **Product Data** | Mock product catalog (15 items: electronics, food, clothing) |
| **Database** | SQLite (better-sqlite3) for purchase history & spending policy |
| **Deployment** | Vercel (free tier) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (v24.11.0 used in development)
- Locus API key (get from [beta.paywithlocus.com](https://beta.paywithlocus.com) with code `PAYGENTIC`)
- OpenRouter API key (get from [openrouter.ai](https://openrouter.ai))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Samanyu-Thakur1703/agent-cart.git
cd agent-cart
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key_here
LOCUS_API_KEY=claw_dev_your_locus_key_here
LOCUS_API_BASE_URL=https://beta-api.paywithlocus.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### 1. Set Spending Limits
When you first open the app, set your spending limits:
- **Max per transaction**: $100 (default)
- **Max per day**: $500 (default)

### 2. Describe What You Want
Type a natural language request like:
- "Buy me a USB-C hub under $30 with good reviews"
- "Get me some coffee beans, max $25"
- "I need a new hoodie, Marvel themed"

### 3. Review AI Recommendations
The AI (via OpenRouter free models) will:
- Parse your intent (extract query, price limits, category)
- Search the product catalog
- Rank top 3 options with reasoning

### 4. Complete Checkout
- Click "Buy with Locus" on your preferred product
- Locus Checkout component renders inline
- Complete payment using your Locus wallet (USDC on Base)
- Receive confirmation with transaction hash

### 5. View Purchase History
Click "Show Purchase History" to see all transactions with:
- Product name and price
- Agent's reasoning for selection
- Date/time of purchase

## 🏗 Architecture

```
agent-cart/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # OpenRouter integration
│   │   ├── checkout/create/route.ts # Locus session creation
│   │   ├── purchases/route.ts     # Purchase history API
│   │   └── webhooks/locus/route.ts # Locus webhook handler
│   ├── page.tsx                   # Main page (redirects to ChatWindow)
│   └── layout.tsx                 # Root layout
├── components/
│   ├── ChatWindow.tsx             # Main chat interface
│   ├── MessageBubble.tsx          # User/agent message display
│   ├── ProductCard.tsx            # Product recommendation card
│   ├── LocusCheckoutButton.tsx    # Locus payment component
│   ├── SpendingPolicy.tsx         # Spending limit controls
│   ├── PurchaseHistory.tsx         # Transaction history panel
│   └── LoadingDots.tsx           # Typing indicator
├── lib/
│   ├── openrouter.ts              # OpenRouter client + AI functions
│   ├── locus.ts                   # Locus SDK wrapper
│   ├── products.ts                # Product search/filter
│   ├── db.ts                      # SQLite database operations
│   └── spending-policy.ts        # Client-side policy store
├── data/
│   └── products.json              # Mock product catalog (15 items)
└── .env.local                     # Environment variables (not committed)
```

## 🔐 Security & Policy Enforcement

### Spending Guardrails
- **Transaction Limit**: No single purchase can exceed the per-transaction limit
- **Daily Limit**: Total spending per day is tracked and enforced
- **Automatic Reset**: Daily spend resets at midnight
- **Policy Storage**: Server-side SQLite for reliability

### Locus Security
- API keys start with `claw_dev_` and are never logged
- All Locus API calls use Bearer token authentication
- Webhook endpoint ready for signature verification (production)
- Wallet operations happen on Base blockchain

## 🐛 Known Issues & Fixes

### Fixed in this version:
- ✅ TypeScript errors in `lib/db.ts` (IGNORE → IGNORE)
- ✅ OpenRouter API key format (`vsk-` → `sk-`)
- ✅ Locus API environment (production → beta)
- ✅ Build passes with `npm run build`

### Current Limitations:
- Product catalog is mocked (15 items only)
- Locus wallet needs manual USDC funding on Base
- No image hosting (uses picsum.photos placeholder)
- Webhook signature verification not implemented

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and import your GitHub repo

3. Add environment variables in Vercel settings:
```
OPENROUTER_API_KEY=sk-or-v1-your_key
LOCUS_API_KEY=claw_dev_your_key
LOCUS_API_BASE_URL=https://beta-api.paywithlocus.com/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. Deploy and get your live URL!

## 🎬 Demo Video Script (90 seconds)

1. **Intro (0-10s)**: "This is AgentCart, the AI shopping agent that browses, decides, and pays"
2. **Chat Demo (10-40s)**: Type "Buy me a USB-C hub under $30" → Show 3 AI-ranked recommendations with reasoning
3. **Checkout Demo (40-70s)**: Click "Buy" → Locus Checkout renders → Complete payment → Show receipt with transaction hash
4. **History Demo (70-90s)**: Open purchase history panel → Show audit trail with reasoning

## 🏆 Hackathon Submission

**Built for:** Locus Hackathon 2026

**Unique Value:**
- First end-to-end agentic commerce demo purpose-built on CheckoutWithLocus
- Not a toy — real product loop: natural language in, USDC payment out
- Showcases every part of Locus's checkout SDK (sessions, line items, wallet payment, receipts)
- Zero AI cost using OpenRouter free models

**Judging Criteria:**
- ✅ **Functionality**: End-to-end flow works (prompt → paid receipt)
- ✅ **Innovation**: First agentic shopping experience on Locus
- ✅ **Design**: Clean chat UI with embedded checkout
- ✅ **Relevance**: Solves real problem (AI agents can't checkout)

## 📚 Resources

- [Locus Documentation](https://docs.paywithlocus.com)
- [OpenRouter Models](https://openrouter.ai/models)
- [Next.js Documentation](https://nextjs.org/docs)
- [CheckoutWithLocus SDK](https://docs.paywithlocus.com/checkout)

## 📄 License

MIT License - feel free to fork and build your own agentic commerce apps!

---

**Built with ❤️ for the Locus Hackathon 2026**
