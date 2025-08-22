import { getBalance, setBalance } from './_sheet';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const { phoneNumber, amount }: { phoneNumber: string; amount: number } = req.body || {};
    const current = await getBalance(phoneNumber);
    const balance = current + Number(amount || 0);
    await setBalance(phoneNumber, balance);
    res.status(200).json({ balance });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to charge balance' });
  }
}
