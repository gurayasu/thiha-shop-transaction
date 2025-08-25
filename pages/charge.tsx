import { useState, Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Toast from "../components/Toast";

export default function Charge() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/charge-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, amount: Number(amount) })
    });
    if (res.ok) {
      setToast({ type: "success", message: "Request sent" });
      setPhone("");
      setAmount("");
      await router.push("/");
    } else {
      const err = await res.json();
      setToast({ type: "error", message: err.error || "Failed to charge" });
    }
    setSubmitting(false);
  };

  return (
    <Fragment>
      <Head>
        <title>Charge Balance</title>
      </Head>

      <main className="mx-auto max-w-xl md:max-w-3xl lg:max-w-5xl p-6 sm:p-8 space-y-8">
        <section
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/5 divide-y divide-slate-200 dark:divide-slate-700"
          aria-labelledby="charge-heading"
        >
          <header className="p-6">
            <h1 id="charge-heading" className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Charge Balance
            </h1>
          </header>

          <form className="p-6 space-y-6 text-sm text-slate-500" onSubmit={submit}>
            <div className="space-y-2">
              <label htmlFor="phone" className="flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
                Phone Number<span aria-hidden="true" className="text-rose-600">*</span>
              </label>
              <input
                id="phone"
                value={phone}
                required
                aria-required="true"
                onChange={e => setPhone(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 font-mono tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
                Amount<span aria-hidden="true" className="text-rose-600">*</span>
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                required
                aria-required="true"
                onChange={e => setAmount(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 font-mono tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              />
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="h-11 min-w-[44px] rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                {submitting ? "Processing..." : "Charge Request"}
              </button>
            </div>
          </form>

          <footer className="p-6">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            >
              Back to Purchase
            </Link>
          </footer>
        </section>

        {toast && <Toast type={toast.type} message={toast.message} />}
      </main>
    </Fragment>
  );
}
