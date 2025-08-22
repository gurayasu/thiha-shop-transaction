import { getProductsSheet } from './_sheet';

export default async function handler(_req: any, res: any) {
  try {
    const rows = await getProductsSheet();
    const products = rows.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      price: Number(row[2]),
    }));
    res.status(200).json(products);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to load products' });
  }
}
