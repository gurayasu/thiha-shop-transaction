# Thiha Shop Transaction

A simple TypeScript/Express application that records product purchases using Google Sheets as a datastore.

## Features

- Fetch products from a Google Sheet and display them on a purchase page.
- Buyers select multiple products; the total price updates dynamically.
- Purchases are recorded in a `Purchases` sheet for later review.
- Admin dashboard shows sales summary per product without sending emails.

The code is structured to allow future expansion such as prepaid balances linked to phone numbers.

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

Visit `http://localhost:3000` for the purchase page and `http://localhost:3000/admin.html` for the sales dashboard.
