import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Charge() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/charge-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, amount: Number(amount) })
    });
    if (res.ok) {
      alert('リクエスト送信完了');
      await router.push('/');
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to charge');
    }
  };

  return (
    <>
      <Head><title>Charge Balance</title></Head>
      <div className="mx-auto mt-4 max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Charge Balance</h1>
        <form onSubmit={submit} id="chargeForm" className="space-y-4">
          <div>
            <label htmlFor="phone" className="block mb-1 text-base text-gray-900">Phone Number</label>
            <input
              id="phone"
              value={phone}
              onChange={e=>setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block mb-1 text-base text-gray-900">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={e=>setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 text-lg bg-blue-600 text-white rounded hover:bg-blue-700">Charge Request</button>
        </form>
        <Link href="/" className="block mt-4 text-blue-600 hover:underline">Back to Purchase</Link>
      </div>
    </>
  );
}
