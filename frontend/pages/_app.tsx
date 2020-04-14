import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline } from '@material-ui/core'
import theme from '../src/theme'
import { Footer } from '../components/PageLayout/Footer'
import CookieConsent from '../components/CookieConsent'
import GoogleAnalytics from '../components/GoogleAnalytics'

export default class FinSharingApp extends App {
  componentDidMount () {
    // remove server-side CSS
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <React.Fragment>
        <Head>
          <title/>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>

          <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
          <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
          <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
          <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
          <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/manifest.json"/>
          <meta name="msapplication-TileColor" content="#ffffff"/>
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>

          <meta property="og:site_name" content="FinSharing.com"/>
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:site" content="@finsharing"/>
          <meta name="twitter:creator" content="@finsharing"/>

          <style>{`
            a {
              color: #2196f3;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
        `}</style>

          {/* Cookie Consent */}
          <link rel="stylesheet" type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.css"/>
        </Head>

        <GoogleAnalytics/>
        <CookieConsent/>

        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Component {...pageProps} />
          <Footer/>
        </ThemeProvider>
      </React.Fragment>
    )
  }

}
