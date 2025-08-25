import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Product { product_id: string; name: string; price: number; }

export default function Home() {
  const [phone, setPhone] = useState('');
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [selections, setSelections] = useState<string[]>(['']);

  useEffect(() => { fetch('/api/products').then(r => r.json()).then(setProducts); }, []);

  const total = selections.reduce((sum, id) => {
    const p = products.find(p => p.product_id === id);
    return p ? sum + p.price : sum;
  }, 0);

  const addProduct = () => setSelections([...selections, '']);

  const changeSelection = (idx: number, val: string) => {
    const next = selections.slice();
    next[idx] = val;
    setSelections(next);
  };

  const loadBalance = async () => {
    if (!phone) return;
    const res = await fetch(`/api/balance/${encodeURIComponent(phone)}`);
    const data = await res.json();
    setBalance(data.balance);
  };

  useEffect(() => {
    loadBalance();
    const handleFocus = () => loadBalance();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsMap = new Map<string, number>();
    selections.forEach(id => { if (id) itemsMap.set(id, (itemsMap.get(id) || 0) + 1); });
    const items = Array.from(itemsMap.entries()).map(([productId, quantity]) => ({ productId, quantity }));
    const res = await fetch('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, items })
    });
    if (res.ok) {
      const data = await res.json();
      setBalance(data.balance);
      setSelections(['']);
      alert('Purchase recorded');
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to record purchase');
    }
  };

  return (
    <>
      <Head>
        <title>Shop</title>
      </Head>
      <div className="mx-auto mt-4 max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Buy Products</h1>
        <form onSubmit={handleSubmit} id="purchaseForm" className="space-y-4">
          <div>
            <label htmlFor="phone" className="block mb-1 text-base text-gray-900">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={e=>setPhone(e.target.value)}
              onBlur={loadBalance}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>Balance: ¥<span id="balance">{balance}</span></div>
          {selections.map((sel, i) => (
            <div key={i}>
              <select
                value={sel}
                onChange={e=>changeSelection(i, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">選択</option>
                {products.map(p => (
                  <option key={p.product_id} value={p.product_id}>{p.name} ¥{p.price}</option>
                ))}
              </select>
            </div>
          ))}
          <button
            type="button"
            id="addProduct"
            onClick={addProduct}
            className="px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Add Product
          </button>
          <div className={`font-bold ${balance < total ? 'text-red-500' : ''}`}>
            Total: ¥<span id="total">{total}</span>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-lg bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Purchase
          </button>
        </form>
        <Link href="/charge" className="block mt-4 text-blue-600 hover:underline">Money Charge</Link>
      </div>
    </>
  );
}
