import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
