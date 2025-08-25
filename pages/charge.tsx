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
      <div className="form-card">
        <h1>Charge Balance</h1>
        <form onSubmit={submit} id="chargeForm">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" value={phone} onChange={e=>setPhone(e.target.value)} />
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
          <button type="submit">Charge Request</button>
        </form>
        <Link href="/">Back to Purchase</Link>
      </div>
    </>
  );
}
