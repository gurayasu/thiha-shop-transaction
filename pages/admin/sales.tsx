import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function SalesPage() {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/sales").then(r => r.json()).then(setData);
  }, []);

  return (
    <AdminLayout title="Sales Dashboard">
      <section
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/5 divide-y divide-slate-200 dark:divide-slate-700"
        aria-labelledby="sales-heading"
      >
        <header className="p-6">
          <h1 id="sales-heading" className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Sales Dashboard
          </h1>
        </header>
        <div className="p-6 text-sm text-slate-500">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 dark:border-slate-700 text-left text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Product ID</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([id, qty]) => (
                  <tr key={id} className="text-slate-900 dark:text-slate-100">
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{id}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
