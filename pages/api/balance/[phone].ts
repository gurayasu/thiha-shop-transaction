import type { NextApiRequest, NextApiResponse } from 'next';
import { getBalance } from '../../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { phone } = req.query;
    const bal = await getBalance(String(phone));
    res.status(200).json({ balance: bal });
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
