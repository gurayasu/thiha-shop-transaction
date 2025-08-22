import { useEffect, useState } from 'react';
import Head from 'next/head';

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
      <div className="form-card">
        <h1 className="form-title">Buy Products</h1>
        <form onSubmit={handleSubmit} id="purchaseForm">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" value={phone} onChange={e=>setPhone(e.target.value)} onBlur={loadBalance} />
          </div>
          <div className="form-group">Balance: ¥<span id="balance">{balance}</span></div>
          {selections.map((sel, i) => (
            <div className="form-group" key={i}>
              <select className="product-select" value={sel} onChange={e=>changeSelection(i, e.target.value)}>
                <option value="">選択</option>
                {products.map(p => (
                  <option key={p.product_id} value={p.product_id}>{p.name} ¥{p.price}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" id="addProduct" className="add-btn" onClick={addProduct}>Add Product</button>
          <div className={`form-group total${balance < total ? ' over' : ''}`}>
            Total: ¥<span id="total">{total}</span>
          </div>
          <button type="submit">Purchase</button>
        </form>
      </div>
    </>
  );
}
