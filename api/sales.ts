import { getTransactions } from './_sheet';

export default async function handler(_req: any, res: any) {
  try {
    const rows = await getTransactions();
    const summary: Record<string, number> = {};
    rows.forEach((row: any[]) => {
      const productId = row[2];
      const qty = Number(row[3] || 0);
      summary[productId] = (summary[productId] || 0) + qty;
    });
    res.status(200).json(summary);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to load sales data' });
  }
}
