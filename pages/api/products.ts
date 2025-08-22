import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsSheet } from '../../lib/sheet';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const items = await getProductsSheet();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(items);
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
