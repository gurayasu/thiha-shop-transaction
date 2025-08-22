import type { NextApiRequest, NextApiResponse } from 'next';
import { getTransactions, getProductsSheet } from '../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [tx, prods] = await Promise.all([
      getTransactions(req.query.start as string, req.query.end as string),
      getProductsSheet()
    ]);
    const pmap = new Map<string, any>(prods.map((p: any) => [String(p.product_id), p]));

    let totalAmount = 0, totalQty = 0;
    const byDay = new Map<string, number>();
    const byProd = new Map<string, any>();

    for (const t of tx) {
      if (t.type !== 'PURCHASE') continue;
      totalAmount += t.total;
      totalQty += t.qty || 0;

      const d = t.timestamp.toISOString().slice(0,10);
      byDay.set(d, (byDay.get(d) || 0) + t.total);

      const p = pmap.get(String(t.product_id));
      const key = String(t.product_id || 'unknown');
      if (!byProd.has(key)) byProd.set(key, { name: p?.name || key, total: 0, qty: 0 });
      const agg = byProd.get(key);
      agg.total += t.total;
      agg.qty += t.qty || 0;
    }

    res.status(200).json({
      totalAmount, totalQty,
      timeseries: Array.from(byDay.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([date,total]) => ({ date, total })),
      products: Array.from(byProd.entries()).map(([product_id, v]) => ({ product_id, ...v })).sort((a,b)=>b.total-a.total)
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
