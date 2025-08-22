import { getBalance } from '../_sheet';

export default async function handler(req: any, res: any) {
  try {
    const phone = Array.isArray(req.query?.phone) ? req.query.phone[0] : req.query?.phone;
    const balance = await getBalance(String(phone));
    res.status(200).json({ balance });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to load balance' });
  }
}
