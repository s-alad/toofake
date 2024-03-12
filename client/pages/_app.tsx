import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from './layout'
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { appWithTranslation } from 'next-i18next'

function App({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Head>
				<title>TooFake</title>
				<meta name="referrer" content="no-referrer" />
				<meta name="description" content="A BeReal Viewer: Post custom BeReal's whenever, View friends BeReals without them knowing " />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta charSet="utf-8" />
				<meta property='og:title' content='TooFake' />
				<meta property='og:description' 
					content="A BeReal Viewer: Post custom BeReal's whenever, View friends BeReals without them knowing. Befake. " 
				/>
				<meta name="viewport" content="width=device-width, user-scalable=no" />
				
				<link rel="icon" href="/TooFake.png" />
				<Script async src="https://toofake-analytics.up.railway.app/script.js" data-website-id="849b3e73-c171-4ee0-bb3c-fd1aba9fe2d5" strategy="lazyOnload"></Script>
				<Script src="https://kit.fontawesome.com/fd7a666cec.js" crossOrigin="anonymous"></Script>
			</Head>

			<Component {...pageProps} />

			<GoogleAnalytics trackPageViews gaMeasurementId='G-0QYBTQCRXD' />
			<Analytics />
		</Layout>
	)
}

/* export default appWithTranslation(App) */
export default App;
