import * as React from 'react'
import ReactGA, { EventArgs } from 'react-ga'

const GoogleAnalyticsService = {
  _initialized: false,

  _initialize () {
    ReactGA.initialize(process.env.GA_TRACKING_CODE || 'UA-000000-01', {
      debug: false
    })
    this._initialized = true
  },

  trackPage (page: string) {
    if (!this._initialized) {
      this._initialize()
    }

    // set timeout needed to give time to refresh the page title
    setTimeout(() => {
      ReactGA.set({ page })
      ReactGA.pageview(page)
    }, 0)
  },

  sendEvent (event: EventArgs) {
    if (!this._initialized) {
      this._initialize()
    }

    ReactGA.event(event)
  }
}

class GoogleAnalytics extends React.Component<{}> {
  currentPage: string = ''

  componentDidMount () {
    this.currentPage = document.location.pathname + document.location.search
    GoogleAnalyticsService.trackPage(this.currentPage)
  }

  componentDidUpdate () {
    if (this.currentPage !== document.location.pathname + document.location.search) {
      this.currentPage = document.location.pathname + document.location.search
      GoogleAnalyticsService.trackPage(this.currentPage)
    }
  }

  render () {
    return <></>
  }
}

export default GoogleAnalytics
