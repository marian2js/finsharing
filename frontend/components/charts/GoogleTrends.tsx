import React from 'react'
import { isServer } from '../../src/utils/environment'

interface Props {
  url: string
}

export const GoogleTrends = (props: Props) => {
  if (isServer) {
    return <div/>
  }

  const { url } = props
  const searchParams = new URL(url).searchParams
  const query = searchParams.get('q') || ''
  const geo = (searchParams.get('geo') || '').toUpperCase()
  const date = searchParams.get('date') || 'today 12-m'
  const cat = searchParams.get('cat') || 0
  const gprop = searchParams.get('gprop') || ''

  const request = {
    comparisonItem: query.split(',').map(term => ({
      keyword: term,
      geo,
      time: date,
    })),
    'category': cat,
    'property': gprop,
  }

  return (
    <>
      <iframe id="trends-widget-1"
              src={`https://trends.google.com/trends/embed/explore/TIMESERIES?req=${encodeURIComponent(JSON.stringify(request))}&tz=-120`}
              width="100%"
              frameBorder="0"
              scrolling="0"
              style={{
                borderRadius: '2px',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 2px 0px rgba(0, 0, 0, 0.24) 0px 2px 2px 0px',
                height: '423px'
              }}/>
    </>
  )
}
