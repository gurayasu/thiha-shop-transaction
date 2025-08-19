import { google, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
}

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor(auth: GoogleAuth, spreadsheetId: string) {
    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;
  }

  async getProducts(): Promise<Product[]> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Products!A2:C',
    });
    const rows = res.data.values || [];
    return rows.map((row) => ({
      id: row[0],
      name: row[1],
      price: Number(row[2]),
    }));
  }

  async recordPurchase(items: PurchaseItem[], phoneNumber?: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const values = items.map((item) => [timestamp, phoneNumber || '', item.productId, item.quantity]);
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Purchases!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }

  async getSalesSummary(): Promise<Record<string, number>> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Purchases!C:D',
    });
    const rows = res.data.values || [];
    const summary: Record<string, number> = {};
    for (const row of rows) {
      const productId = row[0];
      const qty = Number(row[1]);
      summary[productId] = (summary[productId] || 0) + qty;
    }
    return summary;
  }
}
