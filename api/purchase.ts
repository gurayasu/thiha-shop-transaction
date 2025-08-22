import { getProductsSheet, getBalance, setBalance, appendTx } from './_sheet';

interface PurchaseItem { productId: string; quantity: number; }

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const { phoneNumber, items = [] }: { phoneNumber?: string; items?: PurchaseItem[] } = req.body || {};
    const rows = await getProductsSheet();
    const priceMap: Record<string, number> = {};
    rows.forEach((row: any[]) => {
      priceMap[row[0]] = Number(row[2]);
    });
    const total = items.reduce((sum, item) => sum + (priceMap[item.productId] || 0) * item.quantity, 0);
    if (phoneNumber) {
      const balance = await getBalance(phoneNumber);
      if (balance < total) {
        res.status(400).json({ error: 'INSUFFICIENT_BALANCE' });
        return;
      }
      await setBalance(phoneNumber, balance - total);
    }
    for (const item of items) {
      const amount = (priceMap[item.productId] || 0) * item.quantity;
      await appendTx(phoneNumber || '', item.productId, item.quantity, amount);
    }
    const newBalance = phoneNumber ? await getBalance(phoneNumber) : undefined;
    res.status(200).json({ balance: newBalance });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to record purchase' });
  }
}
