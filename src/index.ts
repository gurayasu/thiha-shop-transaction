import "dotenv/config"; // これを一番上に追加
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

app.get("/api/balance/:phone", async (req, res) => {
  try {
    const balance = await sheetsService.getUserBalance(req.params.phone);
    res.json({ balance });
  } catch (e) {
    res.status(500).json({ error: "Failed to load balance" });
  }
});

app.post("/api/purchase", async (req, res) => {
  try {
    const items: PurchaseItem[] = req.body.items;
    const phoneNumber: string | undefined = req.body.phoneNumber;
    const products = await sheetsService.getProducts();
    const priceMap = new Map(products.map((p) => [p.id, p.price]));
    const total = items.reduce(
      (sum, item) => sum + (priceMap.get(item.productId) || 0) * item.quantity,
      0
    );
    let newBalance: number | undefined;
    if (phoneNumber) {
      newBalance = await sheetsService.adjustUserBalance(phoneNumber, -total);
    }
    await sheetsService.recordPurchase(items, phoneNumber);
    res.json({ status: "success", balance: newBalance });
  } catch (e) {
    if (e instanceof Error && e.message === "INSUFFICIENT_BALANCE") {
      res.status(400).json({ error: "Insufficient balance" });
    } else {
      res.status(500).json({ error: "Failed to record purchase" });
    }
  }
});

app.post("/api/charge", async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body as {
      phoneNumber: string;
      amount: number;
    };
    const balance = await sheetsService.adjustUserBalance(phoneNumber, amount);
    res.json({ status: "success", balance });
  } catch (e) {
    res.status(500).json({ error: "Failed to charge balance" });
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
