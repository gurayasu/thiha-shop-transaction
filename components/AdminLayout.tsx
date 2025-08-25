import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function AdminLayout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/5">
          <div className="mx-auto max-w-xl md:max-w-3xl lg:max-w-5xl p-6 sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
          </div>
        </header>
        <nav className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="mx-auto max-w-xl md:max-w-3xl lg:max-w-5xl p-6 sm:p-8 flex gap-6">
            <Link
              href="/admin/requests"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-800"
            >
              Requests
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-800"
            >
              Products
            </Link>
            <Link
              href="/admin/sales"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-800"
            >
              Sales
            </Link>
          </div>
        </nav>
        <main className="mx-auto max-w-xl md:max-w-3xl lg:max-w-5xl p-6 sm:p-8 space-y-8">
          {children}
        </main>
      </div>
    </>
  );
}
