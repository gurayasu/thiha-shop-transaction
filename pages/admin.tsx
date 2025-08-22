import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Admin() {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/sales').then(r => r.json()).then(setData);
  }, []);

  return (
    <>
      <Head><title>Sales Dashboard</title></Head>
      <h1>Sales Dashboard</h1>
      <table border={1}>
        <thead><tr><th>Product ID</th><th>Quantity</th></tr></thead>
        <tbody>
          {Object.entries(data).map(([id, qty]) => (
            <tr key={id}><td>{id}</td><td>{qty}</td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
