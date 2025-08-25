import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";

export default function AdminIndex() {
  return (
    <AdminLayout title="Admin">
      <section
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/5 divide-y divide-slate-200 dark:divide-slate-700"
        aria-labelledby="admin-heading"
      >
        <header className="p-6">
          <h1 id="admin-heading" className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Admin
          </h1>
        </header>
        <div className="p-6">
          <ul className="space-y-2 text-sm text-slate-500">
            <li>
              <Link
                href="/admin/requests"
                className="inline-flex h-11 items-center justify-start rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                Charge Requests
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className="inline-flex h-11 items-center justify-start rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                Product Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/sales"
                className="inline-flex h-11 items-center justify-start rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                Sales Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </AdminLayout>
  );
}
