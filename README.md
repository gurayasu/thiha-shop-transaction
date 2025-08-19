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

## Apps Script + Google Sheets Setup

The `apps-script` folder provides a lightweight implementation that runs entirely on Google Sheets and Apps Script.

1. **Prepare the spreadsheet** with the following sheets and headers:
   - `Products`: `product_id`, `name`, `price`
   - `Users`: `phone_number`, `name`, `balance`
   - `Transactions`: `timestamp`, `phone_number`, `product_id`, `quantity`, `total_amount`

2. **Create the Apps Script project** from the spreadsheet via `Extensions → Apps Script` and add two files:
   - `Code.gs` – server‑side functions (`getProducts`, `getBalance`, `purchase`, `charge`, and `doGet`).
   - `index.html` – client‑side page that calls these functions with `google.script.run`.
   Copy the contents of these files from this repository's `apps-script` directory.

3. **Deploy as a web app**:
   - In the Apps Script editor select `Deploy → New deployment`.
   - Choose `Web app` and grant access to "Anyone with the link" (or more restrictive as needed).
   - Share the resulting URL or QR code with users.

4. **Optional: manage code with clasp**:
   ```sh
   npm install -g @google/clasp
   clasp login
   clasp create --type sheets        # or `clasp clone <SCRIPT_ID>` for existing projects
   clasp push                        # push local files to Apps Script
   clasp deploy                      # update the web app
   ```
