# Thiha Shop Transaction

A simple Next.js application that uses API routes on Vercel with Google Sheets as the datastore—no Apps Script required.

## Features

- Fetch products from the `Products` sheet and display them on a purchase page.
- Buyers can enter a phone number, see their balance and select multiple products with quantities; the total price updates dynamically and purchases are blocked when the balance is insufficient.
- Purchases are recorded in the `Transactions` sheet and user balances are stored in the `Balances` sheet.
- Admin pages show sales summaries and provide a simple interface to charge user balances.

## Setup

1. Clone and install:
   ```sh
   git clone <repo>
   cd thiha-shop-transaction
   npm install
   ```
2. Create `.env.local` with:
   ```sh
   SHEET_ID=...
   GOOGLE_CLIENT_EMAIL=...
   GOOGLE_PRIVATE_KEY=... # use \n for line breaks
   ```
3. Develop locally:
   ```sh
   npm run dev
   ```
   Visit `http://localhost:3000` for the purchase page, `/admin` for the sales dashboard, and `/charge` to charge user balances.
4. Type check:
   ```sh
   npm test
   ```
5. Build for production:
   ```sh
   npm run build
   npx next start
   ```
   or deploy with `vercel`.

On Vercel, set these environment variables in **Project Settings → Environment Variables** or via `vercel env`. See [Vercel's environment variable docs](https://vercel.com/docs/concepts/projects/environment-variables) and [deployment guide](https://vercel.com/docs/deployments/overview) for more details.

