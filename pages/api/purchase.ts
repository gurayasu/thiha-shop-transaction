import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsSheet, getBalance, setBalance, appendTx } from '../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const { phoneNumber, items } = req.body || {};
    if (!phoneNumber || !Array.isArray(items)) return res.status(400).json({ error: 'invalid payload' });

    const prods = await getProductsSheet();
    const map = new Map<string, any>(prods.map((p: any) => [String(p.product_id), p]));
    const txItems: { product_id: string; qty: number; price: number; total: number }[] = [];
    let total = 0;

    for (const it of items) {
      const p = map.get(String(it.productId));
      const q = Number(it.quantity || 0);
      if (!p || q <= 0) continue;
      const lineTotal = p.price * q;
      total += lineTotal;
      txItems.push({ product_id: p.product_id, qty: q, price: p.price, total: lineTotal });
    }

    const bal = await getBalance(phoneNumber);
    if (bal < total) return res.status(400).json({ error: 'insufficient_balance', balance: bal });

    const nb = bal - total;
    await setBalance(phoneNumber, nb);
    for (const it of txItems) {
      await appendTx({
        type: 'PURCHASE',
        phone: phoneNumber,
        product_id: it.product_id,
        qty: it.qty,
        price: it.price,
        total: it.total
      });
    }

    res.status(200).json({ balance: nb });
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
