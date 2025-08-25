import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function SalesPage() {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/sales').then(r => r.json()).then(setData);
  }, []);

  return (
    <AdminLayout title="Sales Dashboard">
      <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>
      <table className="table-auto w-full border border-collapse text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Product ID</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([id, qty]) => (
            <tr key={id}>
              <td className="border px-4 py-2">{id}</td>
              <td className="border px-4 py-2">{qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
