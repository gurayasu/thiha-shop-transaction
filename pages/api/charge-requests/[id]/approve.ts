import type { NextApiRequest, NextApiResponse } from 'next';
import { approveChargeRequest } from '../../../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'missing id' });
    await approveChargeRequest(String(id));
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
