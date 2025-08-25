import Head from 'next/head';
import Link from 'next/link';

export default function AdminIndex() {
  return (
    <>
      <Head><title>Admin</title></Head>
      <h1>Admin</h1>
      <ul>
        <li><Link href="/admin/requests">Charge Requests</Link></li>
        <li><Link href="/admin/products">Product Management</Link></li>
        <li><Link href="/admin/sales">Sales Dashboard</Link></li>
      </ul>
    </>
  );
}
