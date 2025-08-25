import type { NextApiRequest, NextApiResponse } from 'next';
import { createChargeRequest, listChargeRequests, listAdminSubscriptions } from '../../../lib/sheet';
import { sendPush } from '../../../lib/push';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { phoneNumber, amount } = req.body || {};
      const amt = Number(amount || 0);
      if (!phoneNumber || !(amt > 0)) return res.status(400).json({ error: 'invalid payload' });
      const id = await createChargeRequest(phoneNumber, amt);
      const subs = await listAdminSubscriptions();
      for (const s of subs) {
        await sendPush(s.subscription, { title: 'Charge Request', body: `${phoneNumber} requested ${amt}` });
      }
      res.status(200).json({ id });
    } else if (req.method === 'GET') {
      const status = req.query.status === 'approved' ? 'approved' : 'pending';
      const items = await listChargeRequests(status as 'pending' | 'approved');
      res.status(200).json(items);
    } else {
      res.status(405).end();
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
