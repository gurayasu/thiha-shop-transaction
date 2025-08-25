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
  tx: 'Transactions',
  chargeRequests: 'ChargeRequests',
  adminSubscriptions: 'AdminSubscriptions'
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

export async function createProduct({ product_id, name, price }: { product_id: string; name: string; price: number }) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${N.products}!A:C`,
    valueInputOption: 'RAW',
    requestBody: { values: [[product_id, name, price]] }
  });
}

export async function updateProduct({ product_id, name, price }: { product_id: string; name: string; price: number }) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.products}!A2:C`
  });
  const rows = res.data.values || [];
  const idx = rows.findIndex(r => String(r[0]) === String(product_id));
  if (idx < 0) return;
  const rowNumber = idx + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${N.products}!B${rowNumber}:C${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[name, price]] }
  });
}

export async function deleteProduct(product_id: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.products}!A2:C`
  });
  const rows = res.data.values || [];
  const idx = rows.findIndex(r => String(r[0]) === String(product_id));
  if (idx < 0) return;
  const rowNumber = idx + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${N.products}!A${rowNumber}:C${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['', '', '']] }
  });
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

export async function createChargeRequest(phone: string, amount: number) {
  const id = Date.now().toString(36);
  const ts = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${N.chargeRequests}!A:F`,
    valueInputOption: 'RAW',
    requestBody: { values: [[id, phone, amount, false, ts, '']] }
  });
  return id;
}

export async function listChargeRequests(status: 'pending' | 'approved') {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.chargeRequests}!A2:F`
  });
  const rows = res.data.values || [];
  return rows
    .map(r => ({
      id: r[0],
      phone: r[1],
      amount: Number(r[2] || 0),
      approved: r[3] === true || r[3] === 'TRUE' || r[3] === 'true',
      requested_at: r[4] || '',
      approved_at: r[5] || ''
    }))
    .filter(r => (status === 'approved' ? r.approved : !r.approved));
}

export async function approveChargeRequest(id: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.chargeRequests}!A2:F`
  });
  const rows = res.data.values || [];
  const idx = rows.findIndex(r => String(r[0]) === String(id));
  if (idx < 0) return;
  const row = rows[idx];
  const rowNumber = idx + 2;
  const phone = row[1];
  const amount = Number(row[2] || 0);
  const ts = new Date().toISOString();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${N.chargeRequests}!D${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[true]] }
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${N.chargeRequests}!F${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[ts]] }
  });
  const bal = await getBalance(phone);
  const nb = bal + amount;
  await setBalance(phone, nb);
  await appendTx({ type: 'CHARGE', phone, total: amount, note: `ChargeRequest ${id}` });
}

export async function saveAdminSubscription(adminId: string, subscription: any) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.adminSubscriptions}!A2:B`
  });
  const rows = res.data.values || [];
  const idx = rows.findIndex(r => String(r[0]) === String(adminId));
  const json = JSON.stringify(subscription);
  if (idx >= 0) {
    const rowNumber = idx + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${N.adminSubscriptions}!B${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[json]] }
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${N.adminSubscriptions}!A:B`,
      valueInputOption: 'RAW',
      requestBody: { values: [[adminId, json]] }
    });
  }
}

export async function listAdminSubscriptions() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${N.adminSubscriptions}!A2:B`
  });
  const rows = res.data.values || [];
  return rows
    .filter(r => r[0] && r[1])
    .map(r => ({ adminId: r[0], subscription: JSON.parse(r[1]) }));
}
