import * as React from 'react'
import { GoogleAnalyticsService } from '../src/services/GoogleAnalyticsService'

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
