import { useEffect, useState } from 'react';
import Head from 'next/head';

interface Product { product_id: string; name: string; price: number; }

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState({ product_id: '', name: '', price: '' });
  const [editing, setEditing] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { product_id: form.product_id, name: form.name, price: Number(form.price) };
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setForm({ product_id: '', name: '', price: '' });
      setEditing(null);
      load();
    }
  };

  const edit = (p: Product) => {
    setEditing(p.product_id);
    setForm({ product_id: p.product_id, name: p.name, price: String(p.price) });
  };

  const del = async (id: string) => {
    if (!window.confirm('Delete?')) return;
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: id })
    });
    if (res.ok) load();
  };

  const cancel = () => {
    setEditing(null);
    setForm({ product_id: '', name: '', price: '' });
  };

  return (
    <>
      <Head><title>Product Management</title></Head>
      <div className="mx-auto mt-4 max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Product Management</h1>
        <form onSubmit={submit} className="space-y-2 mb-4">
          <input
            placeholder="Product ID"
            value={form.product_id}
            onChange={e=>setForm({ ...form, product_id: e.target.value })}
            disabled={!!editing}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            placeholder="Name"
            value={form.name}
            onChange={e=>setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={e=>setForm({ ...form, price: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" onClick={cancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>}
          </div>
        </form>
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.product_id}>
                <td className="border p-2">{p.product_id}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.price}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => edit(p)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                  <button onClick={() => del(p.product_id)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
