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
      <div className="container mx-auto mt-4 max-w-md">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h1 className="text-xl font-bold">Charge Balance</h1>
          <form onSubmit={submit} id="chargeForm" className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-base text-gray-900">Phone Number</label>
              <input
                id="phone"
                value={phone}
                onChange={e=>setPhone(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="amount" className="block text-base text-gray-900">Amount</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={e=>setAmount(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Charge Request</button>
          </form>
          <Link href="/" className="block text-blue-600 hover:underline">Back to Purchase</Link>
        </div>
      </div>
    </>
  );
}
