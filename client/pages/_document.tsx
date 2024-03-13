import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { GoogleAnalytics } from 'nextjs-google-analytics'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<Script async src="https://toofake-analytics.up.railway.app/script.js" data-website-id="849b3e73-c171-4ee0-bb3c-fd1aba9fe2d5" strategy="lazyOnload"></Script>
				<Script async src="https://toofake-analytics.up.railway.app/script.js" data-website-id="fb480e66-7c55-423b-9543-753b669fbfca" strategy="lazyOnload"></Script>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
