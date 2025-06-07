import type { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Theioptera</title>
        <meta name="description" content="Vision that gives science wings - Modular AI research assistant for biomedical hypothesis generation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>" />
      </Head>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 73px)' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
