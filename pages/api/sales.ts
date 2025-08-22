import type { NextApiRequest, NextApiResponse } from 'next';
import { getTransactions } from '../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tx = await getTransactions(req.query.start as string, req.query.end as string);
    const summary: any = {};
    for (const t of tx) {
      if (t.type !== 'PURCHASE') continue;
      const id = t.product_id || 'unknown';
      summary[id] = (summary[id] || 0) + (t.qty || 0);
    }
    res.status(200).json(summary);
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
