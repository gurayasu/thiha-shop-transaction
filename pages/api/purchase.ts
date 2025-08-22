import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsSheet, getBalance, setBalance, appendTx } from '../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const { phoneNumber, items } = req.body || {};
    if (!phoneNumber || !Array.isArray(items)) return res.status(400).json({ error: 'invalid payload' });

    const prods = await getProductsSheet();
    const map = new Map(prods.map(p => [String(p.product_id), p]));
    let total = 0;
    for (const it of items) {
      const p = map.get(String(it.productId));
      const q = Number(it.quantity || 0);
      if (!p || q <= 0) continue;
      total += p.price * q;
    }

    const bal = await getBalance(phoneNumber);
    if (bal < total) return res.status(400).json({ error: 'insufficient_balance', balance: bal });

    const nb = bal - total;
    await setBalance(phoneNumber, nb);
    await appendTx({ type: 'PURCHASE', phone: phoneNumber, total });

    res.status(200).json({ balance: nb });
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
