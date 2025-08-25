import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

interface Product {
  product_id: string;
  name: string;
  price: number;
}

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState({ product_id: "", name: "", price: "" });
  const [editing, setEditing] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setItems(data);
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { product_id: form.product_id, name: form.name, price: Number(form.price) };
    const method = editing ? "PUT" : "POST";
    const res = await fetch("/api/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setForm({ product_id: "", name: "", price: "" });
      setEditing(null);
      load();
    }
  };

  const edit = (p: Product) => {
    setEditing(p.product_id);
    setForm({ product_id: p.product_id, name: p.name, price: String(p.price) });
  };

  const del = async (id: string) => {
    if (!window.confirm("Delete?")) return;
    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: id })
    });
    if (res.ok) load();
  };

  const cancel = () => {
    setEditing(null);
    setForm({ product_id: "", name: "", price: "" });
  };

  return (
    <AdminLayout title="Product Management">
      <section
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/5 divide-y divide-slate-200 dark:divide-slate-700"
        aria-labelledby="products-heading"
      >
        <header className="p-6">
          <h1 id="products-heading" className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Product Management
          </h1>
        </header>
        <div className="p-6 space-y-6 text-sm text-slate-500">
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="product_id" className="flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
                Product ID<span aria-hidden="true" className="text-rose-600">*</span>
              </label>
              <input
                id="product_id"
                value={form.product_id}
                onChange={e => setForm({ ...form, product_id: e.target.value })}
                required
                aria-required="true"
                disabled={!!editing}
                className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 font-mono tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
                Name<span aria-hidden="true" className="text-rose-600">*</span>
              </label>
              <input
                id="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                aria-required="true"
                className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
                Price<span aria-hidden="true" className="text-rose-600">*</span>
              </label>
              <input
                id="price"
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
                aria-required="true"
                className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 font-mono tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              />
            </div>
            <div className="flex gap-2 pt-6">
              <button
                type="submit"
                className="h-11 min-w-[44px] rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                {editing ? "Update" : "Add"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={cancel}
                  className="h-11 min-w-[44px] rounded-xl border border-blue-600 text-blue-600 px-6 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 dark:border-slate-700 text-left text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">ID</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Name</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">Price</th>
                  <th className="border border-slate-200 dark:border-slate-700 px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.product_id} className="text-slate-900 dark:text-slate-100">
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{p.product_id}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{p.name}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">¥{p.price}</td>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 space-x-2">
                      <button
                        onClick={() => edit(p)}
                        className="h-11 min-w-[44px] rounded-xl border border-blue-600 text-blue-600 px-6 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => del(p.product_id)}
                        className="h-11 min-w-[44px] rounded-xl border border-rose-600 text-rose-600 px-6 hover:bg-rose-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                      >
                        Delete
                      </button>
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
