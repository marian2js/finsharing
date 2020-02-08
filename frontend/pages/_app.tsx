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
