import * as React from 'react'

declare global {
  interface Window {
    cookieconsent: any
  }
}

class CookieConsent extends React.PureComponent<{}> {
  componentDidMount () {
    if (typeof window === 'undefined') {
      return
    }
    require('cookieconsent')
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#eaf7f7',
          text: '#5c7291'
        },
        button: {
          background: '#56cbdb',
          text: '#ffffff'
        }
      },
      showLink: false,
      content: {
        message:
          `This website uses cookies to provide necessary site functionality and improve your experience.
           By using it, you agree to our <a href="/legal/privacy-policy">privacy policy</a>
           and our <a href="/legal/cookie-policy">cookie policy</a>.`,
        dismiss: 'OK'
      }
    })
  }

  render () {
    return <div/>
  }
}

export default CookieConsent
