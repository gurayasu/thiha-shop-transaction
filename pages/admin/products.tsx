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
      <h1>Product Management</h1>
      <form onSubmit={submit}>
        <input placeholder="Product ID" value={form.product_id} onChange={e=>setForm({ ...form, product_id: e.target.value })} disabled={!!editing} />
        <input placeholder="Name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({ ...form, price: e.target.value })} />
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={cancel}>Cancel</button>}
      </form>
      <table border={1}>
        <thead><tr><th>ID</th><th>Name</th><th>Price</th><th></th></tr></thead>
        <tbody>
          {items.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={() => edit(p)}>Edit</button>
                <button onClick={() => del(p.product_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
