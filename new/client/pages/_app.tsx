import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from './layout'
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
				<title>TooFake</title>
				<meta name="description" content="A BeReal Viewer: Post custom BeReal's whenever, View friends BeReals without them knowing " />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta property='og:title' content='TooFake' />
        <meta property='og:description' content="A BeReal Viewer: Post custom BeReal's whenever, View friends BeReals without them knowing "/>

				<link rel="icon" href="/TooFake.png" />
			</Head>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  )
}
