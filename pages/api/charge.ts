import type { NextApiRequest, NextApiResponse } from 'next';
import { getBalance, setBalance, appendTx } from '../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const { phoneNumber, amount, note } = req.body || {};
    const amt = Number(amount || 0);
    if (!phoneNumber || !(amt > 0)) return res.status(400).json({ error: 'invalid payload' });

    const bal = await getBalance(phoneNumber);
    const nb = bal + amt;
    await setBalance(phoneNumber, nb);
    await appendTx({ type: 'CHARGE', phone: phoneNumber, total: amt, note: note || '' });

    res.status(200).json({ balance: nb });
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
