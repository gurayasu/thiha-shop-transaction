import { getTransactions } from './_sheet';

export default async function handler(_req: any, res: any) {
  try {
    const rows = await getTransactions();
    res.status(200).json(rows);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to load summary' });
  }
}
