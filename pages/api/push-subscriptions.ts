import type { NextApiRequest, NextApiResponse } from 'next';
import { saveAdminSubscription } from '../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const { adminId, subscription } = req.body || {};
    if (!adminId || !subscription) {
      return res.status(400).json({ error: 'invalid payload' });
    }
    await saveAdminSubscription(adminId, subscription);
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
