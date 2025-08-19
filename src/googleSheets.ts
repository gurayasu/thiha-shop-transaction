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

  private async findUserRow(phoneNumber: string): Promise<{ row: number; balance: number } | null> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Users!A2:C',
    });
    const rows = res.data.values || [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === phoneNumber) {
        return { row: i + 2, balance: Number(rows[i][2] || 0) };
      }
    }
    return null;
  }

  async getUserBalance(phoneNumber: string): Promise<number> {
    const row = await this.findUserRow(phoneNumber);
    return row ? row.balance : 0;
  }

  private async setUserBalance(phoneNumber: string, balance: number): Promise<void> {
    const row = await this.findUserRow(phoneNumber);
    if (row) {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Users!C${row.row}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[balance]] },
      });
    } else {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Users!A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[phoneNumber, '', balance]] },
      });
    }
  }

  async adjustUserBalance(phoneNumber: string, delta: number): Promise<number> {
    const current = await this.getUserBalance(phoneNumber);
    const next = current + delta;
    if (next < 0) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
    await this.setUserBalance(phoneNumber, next);
    return next;
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
