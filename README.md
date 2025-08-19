# Thiha Shop Transaction

A simple TypeScript/Express application that records product purchases using Google Sheets as a datastore.

## Features

- Fetch products from a Google Sheet and display them on a purchase page.
- Buyers can enter a phone number, see their balance and select multiple products with quantities; the total price updates dynamically and purchases are blocked when the balance is insufficient.
- Purchases are recorded in a `Purchases` sheet and user balances are deducted in the `Users` sheet.
- Admin pages show sales summaries and provide a simple interface to charge user balances.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set the `SPREADSHEET_ID` environment variable to the Google Sheet ID.
3. Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to a service account key with spreadsheet access.
4. Build and run:
   ```sh
   npm run build
   npm start
   ```

Visit `http://localhost:3000` for the purchase page, `http://localhost:3000/admin.html` for the sales dashboard, and `http://localhost:3000/charge.html` to charge user balances.
