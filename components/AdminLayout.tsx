import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export default function AdminLayout({ title, children }: Props) {
  return (
    <>
      <Head><title>{title}</title></Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </header>
        <nav className="bg-white shadow p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/admin/requests" className="text-blue-600 hover:underline">Requests</Link>
            </li>
            <li>
              <Link href="/admin/products" className="text-blue-600 hover:underline">Products</Link>
            </li>
            <li>
              <Link href="/admin/sales" className="text-blue-600 hover:underline">Sales</Link>
            </li>
          </ul>
        </nav>
        <main className="p-4">{children}</main>
      </div>
    </>
  );
}
