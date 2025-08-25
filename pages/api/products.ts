import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsSheet, createProduct, updateProduct, deleteProduct } from '../../lib/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const items = await getProductsSheet();
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
      res.status(200).json(items);
    } else if (req.method === 'POST') {
      const { product_id, name, price } = req.body || {};
      if (!product_id || !name) return res.status(400).json({ error: 'invalid payload' });
      await createProduct({ product_id, name, price: Number(price) });
      res.status(200).json({ ok: true });
    } else if (req.method === 'PUT') {
      const { product_id, name, price } = req.body || {};
      if (!product_id) return res.status(400).json({ error: 'invalid payload' });
      await updateProduct({ product_id, name, price: Number(price) });
      res.status(200).json({ ok: true });
    } else if (req.method === 'DELETE') {
      const { product_id } = req.body || {};
      if (!product_id) return res.status(400).json({ error: 'invalid payload' });
      await deleteProduct(product_id);
      res.status(200).json({ ok: true });
    } else {
      res.status(405).end();
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
