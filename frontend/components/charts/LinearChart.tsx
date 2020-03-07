import * as React from 'react'
import { isServer } from '../../src/utils/environment'

interface OwnProps {
  title?: string
  xaxis: string[]
  yaxis: string[]
  data: {
    title: string
    values: number[]
  }[]
}

const LinearChart = (props: OwnProps) => {
  if (isServer) {
    return <div/>
  }

  const Chart = require('react-apexcharts').default
  const { title, xaxis, yaxis, data } = props

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: title,
      align: 'center',
    },
    xaxis: {
      categories: xaxis,
    },
    yaxis: yaxis.map(series => ({
      seriesName: series,
      labels: {
        formatter: (value: number) => value.toLocaleString(),
        style: {
          color: '#008FFB',
        }
      },
      tooltip: {
        enabled: false
      }
    })),
    theme: {
      mode: 'dark',
    }
  }

  const chartSeries = data
    .map(dataItem => ({
      name: dataItem.title,
      type: 'line',
      data: dataItem.values.map(value => Number.isNaN(value) ? 0 : value)
    }))
    .sort((a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1])

  return (
    <Chart options={chartOptions} series={chartSeries} height={400}/>
  )
}

export default LinearChart
