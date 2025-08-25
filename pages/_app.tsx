import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.location.pathname.startsWith('/admin')) return;
    const register = async () => {
      try {
        if (!('serviceWorker' in navigator)) return;
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
        const reg = await navigator.serviceWorker.register('/sw.js');
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          const vapid = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;
          const key = vapid ? urlBase64ToUint8Array(vapid) : undefined;
          sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
        }
        await fetch('/api/push-subscriptions', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ adminId: 'admin', subscription: sub })
        });
      } catch (e) {
        console.error(e);
      }
    };
    register();
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}
