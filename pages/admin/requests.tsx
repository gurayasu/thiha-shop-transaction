import { useEffect, useState } from 'react';
import Head from 'next/head';

interface Request {
  id: string;
  phone: string;
  amount: number;
  approved: boolean;
  requested_at: string;
  approved_at: string;
}

export default function RequestsPage() {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [items, setItems] = useState<Request[]>([]);

  const load = async (status: 'pending' | 'approved') => {
    const res = await fetch(`/api/charge-requests?status=${status}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => { load(tab); }, [tab]);

  const approve = async (id: string) => {
    if (!window.confirm('Are you confirm this request?')) return;
    const res = await fetch(`/api/charge-requests/${id}/approve`, { method: 'POST' });
    if (res.ok) load(tab);
  };

  return (
    <>
      <Head><title>Charge Requests</title></Head>
      <h1>Charge Requests</h1>
      <div>
        <button disabled={tab === 'pending'} onClick={() => setTab('pending')}>pending</button>
        <button disabled={tab === 'approved'} onClick={() => setTab('approved')}>approved</button>
      </div>
      <table border={1}>
        <thead>
          <tr><th>ID</th><th>Phone</th><th>Amount</th><th>Requested</th><th>Approved</th><th></th></tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.phone}</td>
              <td>{r.amount}</td>
              <td>{r.requested_at}</td>
              <td>{r.approved_at}</td>
              <td>{!r.approved && <button onClick={() => approve(r.id)}>Approve</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
