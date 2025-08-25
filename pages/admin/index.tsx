import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

export default function AdminIndex() {
  return (
    <AdminLayout title="Admin">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <ul className="list-disc pl-5 space-y-2">
        <li><Link href="/admin/requests" className="text-blue-600 hover:underline">Charge Requests</Link></li>
        <li><Link href="/admin/products" className="text-blue-600 hover:underline">Product Management</Link></li>
        <li><Link href="/admin/sales" className="text-blue-600 hover:underline">Sales Dashboard</Link></li>
      </ul>
    </AdminLayout>
  );
}
