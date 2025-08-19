import express from "express";
import path from "path";
import { google } from "googleapis";
import { GoogleSheetsService, PurchaseItem } from "./googleSheets";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const spreadsheetId = process.env.SPREADSHEET_ID || "";
const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheetsService = new GoogleSheetsService(auth, spreadsheetId);

app.get("/api/products", async (_req, res) => {
  try {
    const products = await sheetsService.getProducts();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

app.post("/api/purchase", async (req, res) => {
  try {
    const items: PurchaseItem[] = req.body.items;
    const phoneNumber: string | undefined = req.body.phoneNumber;
    await sheetsService.recordPurchase(items, phoneNumber);
    res.json({ status: "success" });
  } catch (e) {
    res.status(500).json({ error: "Failed to record purchase" });
  }
});

app.get("/api/sales", async (_req, res) => {
  try {
    const summary = await sheetsService.getSalesSummary();
    res.json(summary);
  } catch (e) {
    res.status(500).json({ error: "Failed to load sales data" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
