import { google } from 'googleapis';

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes
);

const sheets = google.sheets({ version: 'v4', auth });

const SHEET_ID = process.env.SHEET_ID || '';
const N = {
  products: 'Products',
  balances: 'Balances',
  tx: 'Transactions'
};

export async function getProductsSheet() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.products}!A2:C`
  });
  const rows = res.data.values || [];
  return rows
    .filter(r => r[0])
    .map(([product_id, name, price]) => ({
      product_id: String(product_id),
      name: String(name || ''),
      price: Number(price || 0)
    }));
}

export async function getBalance(phone: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.balances}!A2:B`
  });
  const rows = res.data.values || [];
  const hit = rows.find(r => String(r[0]) === String(phone));
  return hit ? Number(hit[1] || 0) : 0;
}

export async function setBalance(phone: string, newBalance: number) {
  const get = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.balances}!A2:B`
  });
  const rows = get.data.values || [];
  const idx = rows.findIndex(r => String(r[0]) === String(phone));
  if (idx >= 0) {
    const rowNumber = idx + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${N.balances}!B${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[newBalance]] }
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${N.balances}!A:B`,
      valueInputOption: 'RAW',
      requestBody: { values: [[phone, newBalance]] }
    });
  }
}

export async function appendTx({ type, phone, product_id = '', qty = 0, price = 0, total = 0, note = '' }: any) {
  const ts = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${N.tx}!A:H`,
    valueInputOption: 'RAW',
    requestBody: { values: [[ts, type, phone, product_id, qty, price, total, note]] }
  });
}

export async function getTransactions(startISO?: string, endISO?: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.tx}!A2:H`
  });
  const rows = res.data.values || [];
  const start = startISO ? new Date(startISO) : new Date(Date.now() - 30 * 864e5);
  const end = endISO ? new Date(endISO) : new Date();
  return rows
    .map(r => ({
      timestamp: new Date(r[0]),
      type: r[1] || '',
      phone: r[2] || '',
      product_id: r[3] || '',
      qty: Number(r[4] || 0),
      price: Number(r[5] || 0),
      total: Number(r[6] || 0),
      note: r[7] || ''
    }))
    .filter((t: any) => t.timestamp >= start && t.timestamp <= end)
    .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime());
}
