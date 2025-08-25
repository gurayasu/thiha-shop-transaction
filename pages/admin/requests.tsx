import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

interface Request {
  id: string;
  phone: string;
  amount: number;
  approved: boolean;
  requested_at: string;
  approved_at: string;
}

export default function RequestsPage() {
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [items, setItems] = useState<Request[]>([]);

  const load = async (status: "pending" | "approved") => {
    const res = await fetch(`/api/charge-requests?status=${status}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const approve = async (id: string) => {
    if (!window.confirm("Are you confirm this request?")) return;
    const res = await fetch(`/api/charge-requests/${id}/approve`, { method: "POST" });
    if (res.ok) load(tab);
  };

  return (
    <AdminLayout title="Charge Requests">
      <section
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/5 divide-y divide-slate-200 dark:divide-slate-700"
        aria-labelledby="requests-heading"
      >
        <header className="p-6">
          <h1 id="requests-heading" className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Charge Requests
          </h1>
        </header>
        <div className="p-6 space-y-6 text-sm text-slate-500">
          <div className="flex gap-4">
            <button
              className="h-11 min-w-[44px] rounded-xl border border-blue-600 text-blue-600 px-6 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50"
              disabled={tab === "pending"}
              onClick={() => setTab("pending")}
            >
              pending
            </button>
            <button
              className="h-11 min-w-[44px] rounded-xl border border-blue-600 text-blue-600 px-6 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50"
              disabled={tab === "approved"}
              onClick={() => setTab("approved")}
            >
              approved
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 dark:border-slate-700 text-left text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                <tr>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">ID</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Phone</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Amount</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Requested</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Approved</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.id} className="text-slate-900 dark:text-slate-100">
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{r.id}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{r.phone}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">¥{r.amount}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{r.requested_at}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{r.approved_at}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                      {!r.approved && (
                        <button
                          onClick={() => approve(r.id)}
                          className="h-11 min-w-[44px] rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                        >
                          Approve
                        </button>
                      )}
                    </td>
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
