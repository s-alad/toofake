import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from './layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
				<title>TooFake</title>
				<meta name="description" content="" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
      <Component {...pageProps} />
    </Layout>
  )
}
