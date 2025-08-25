import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

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
    <AdminLayout title="Charge Requests">
      <h1 className="text-2xl font-bold mb-4">Charge Requests</h1>
      <div className="space-x-2 mb-4">
        <button className="btn btn-secondary" disabled={tab === 'pending'} onClick={() => setTab('pending')}>pending</button>
        <button className="btn btn-secondary" disabled={tab === 'approved'} onClick={() => setTab('approved')}>approved</button>
      </div>
      <table className="table-auto w-full border border-collapse text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Requested</th>
            <th className="border px-4 py-2">Approved</th>
            <th className="border px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={r.id}>
              <td className="border px-4 py-2">{r.id}</td>
              <td className="border px-4 py-2">{r.phone}</td>
              <td className="border px-4 py-2">{r.amount}</td>
              <td className="border px-4 py-2">{r.requested_at}</td>
              <td className="border px-4 py-2">{r.approved_at}</td>
              <td className="border px-4 py-2">{!r.approved && <button className="btn btn-secondary btn-sm" onClick={() => approve(r.id)}>Approve</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
