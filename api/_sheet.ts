import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  credentials: process.env.GOOGLE_CLIENT_EMAIL
    ? {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }
    : undefined,
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.SPREADSHEET_ID || '';

async function findUserRow(phone: string): Promise<{ row: number; balance: number } | null> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Users!A2:C',
  });
  const rows = res.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === phone) {
      return { row: i + 2, balance: Number(rows[i][2] || 0) };
    }
  }
  return null;
}

export async function getProductsSheet() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Products!A2:C',
  });
  return res.data.values || [];
}

export async function getBalance(phone: string): Promise<number> {
  const row = await findUserRow(phone);
  return row ? row.balance : 0;
}

export async function setBalance(phone: string, balance: number) {
  const row = await findUserRow(phone);
  if (row) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Users!C${row.row}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[balance]] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Users!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[phone, '', balance]] },
    });
  }
}

export async function appendTx(phone: string, productId: string, quantity: number, amount: number) {
  const timestamp = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Transactions!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[timestamp, phone, productId, quantity, amount]] },
  });
}

export async function getTransactions() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Transactions!A:E',
  });
  return res.data.values || [];
}
