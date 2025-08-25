import { useEffect, useState, Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import Toast from "../components/Toast";

interface Product {
  product_id: string;
  name: string;
  price: number;
}

export default function Home() {
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [selections, setSelections] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);

  const loadBalance = async () => {
    if (!phone) return;
    const res = await fetch(`/api/balance/${encodeURIComponent(phone)}`);
    const data = await res.json();
    setBalance(data.balance);
  };

  useEffect(() => {
    loadBalance();
    const handleFocus = () => loadBalance();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [phone]);

  const changeSelection = (idx: number, value: string) => {
    const next = [...selections];
    next[idx] = value;
    setSelections(next);
  };

  const addProduct = () => setSelections([...selections, ""]);

  const total = selections.reduce((sum, id) => {
    const p = products.find(p => p.product_id === id);
    return p ? sum + p.price : sum;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const itemsMap = new Map<string, number>();
    selections.forEach(id => {
      if (id) itemsMap.set(id, (itemsMap.get(id) || 0) + 1);
    });
    const items = Array.from(itemsMap.entries()).map(([productId, quantity]) => ({ productId, quantity }));
    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, items })
    });
    if (res.ok) {
      const data = await res.json();
      setBalance(data.balance);
      setSelections([""]);
      setToast({ type: "success", message: "Purchase recorded" });
    } else {
      const err = await res.json();
      setToast({ type: "error", message: err.error || "Failed to record purchase" });
    }
    setSubmitting(false);
  };

  return (
    <Fragment>
      <Head>
        <title>Shop</title>
      </Head>

      <main className="mx-auto max-w-xl md:max-w-3xl lg:max-w-5xl p-6 sm:p-8 space-y-8">
        <section
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/5 divide-y divide-slate-200 dark:divide-slate-700"
          aria-labelledby="purchase-heading"
        >
          <header className="p-6">
            <h1 id="purchase-heading" className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Buy Products
            </h1>
          </header>

          <form
            className="p-6 space-y-6 text-sm text-slate-500"
            onSubmit={handleSubmit}
            aria-describedby="balance total"
          >
            <div className="space-y-2">
              <label htmlFor="phone" className="flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
                Phone Number<span aria-hidden="true" className="text-rose-600">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                required
                aria-required="true"
                aria-describedby="phone-help"
                onChange={e => setPhone(e.target.value)}
                onBlur={loadBalance}
                className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 font-mono tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              />
              <p id="phone-help" className="text-xs text-slate-500">
                Enter customer phone number.
              </p>
            </div>

            <p id="balance" className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
              Balance: ¥{balance}
            </p>

            {selections.map((sel, i) => (
              <div key={i} className="space-y-2">
                <label htmlFor={`product-${i}`} className="sr-only">
                  Product {i + 1}
                </label>
                <select
                  id={`product-${i}`}
                  value={sel}
                  required={i === 0}
                  aria-required={i === 0 ? "true" : undefined}
                  onChange={e => changeSelection(i, e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                >
                  <option value="">選択</option>
                  {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.name} ¥{p.price}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="button"
              onClick={addProduct}
              className="h-11 min-w-[44px] rounded-xl border border-blue-600 text-blue-600 px-6 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            >
              Add Product
            </button>

            <p
              id="total"
              className={`font-mono tabular-nums font-semibold ${
                balance < total ? "text-rose-600" : "text-slate-900 dark:text-slate-100"
              }`}
            >
              Total: ¥{total}
            </p>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="h-11 min-w-[44px] rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                {submitting ? "Processing..." : "Purchase"}
              </button>
            </div>
          </form>

          <footer className="p-6">
            <Link
              href="/charge"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            >
              Money Charge
            </Link>
          </footer>
        </section>

        {toast && <Toast type={toast.type} message={toast.message} />}
      </main>
    </Fragment>
  );
}
