import * as React from 'react'
import { useState } from 'react'
import Head from 'next/head'
import { Layout } from '../../components/PageLayout/Layout'
import { withApollo } from '../../src/apollo'
import { RedisClient } from '../../src/clients/redis'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { countries } from 'countries-list'
import Link from 'next/link'
import { makeStyles } from '@material-ui/styles'
import { getComparator, stableSort } from '../../src/utils/arrays'
import { roundDecimals } from '../../src/utils/number'

const useStyles = makeStyles({
  countryTableRow: {
    cursor: 'pointer',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
})

interface Props {
  cases: { [key: string]: number }
  deaths: { [key: string]: number }
}

function CoronavirusPage (props: Props) {
  const classes = useStyles()
  const { cases, deaths } = props
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState<string>('cases')

  const countryList = Object.values(countries)
    .sort((a, b) => a.name > b.name ? 1 : -1)
    .map(country => {
      const countryKey = country.name.toLowerCase().replace(/\s/g, '-')
      return {
        countryKey,
        name: country.name,
        emoji: country.emoji,
        cases: cases[countryKey] || 0,
        deaths: deaths[countryKey] || 0,
        doubling: cases[`double_${countryKey}`],
        change: cases[`change_${countryKey}`] || -Infinity,
      }
    })

  const handleSort = (e: React.MouseEvent<unknown>, property: string) => {
    e.preventDefault()
    const isDesc = orderBy === property && order === 'desc'
    setOrder(isDesc ? 'asc' : 'desc')
    setOrderBy(property)
  }

  const tableHeadCells = [
    { id: 'name', label: 'Country' },
    { id: 'cases', label: 'Total cases' },
    { id: 'deaths', label: 'Total deaths' },
    { id: 'doubling', label: 'Cases doubling time' },
    { id: 'change', label: '5 days change' },
  ]

  const title = 'Cases of coronavirus by country'
  const description = 'Statistics of coronavirus cases reported by country. Daily chart of covid-19 cases reported by country.'
  const url = 'https://finsharing.com/coronavirus'

  return (
    <Layout>
      <Head>
        <title>Cases of coronavirus by country</title>
        <meta name="description"
              content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:url" content={url}/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <link rel="canonical" href={url}/>
      </Head>

      <Box mb={3}>
        <Grid container>
          <Grid item xs>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  Total cases
                </Typography>
                <Typography variant="h4">
                  {cases.total.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  Total deaths
                </Typography>
                <Typography variant="h4">
                  {deaths.total.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box mb={3}>
        <a href="/coronavirus/travel-restrictions">
          <Typography variant="subtitle2">
            🛬 Travel restrictions by country due to COVID-19
          </Typography>
        </a>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="country table">
          <TableHead>
            <TableRow>
              {
                tableHeadCells.map((headCell, i) => (
                  <TableCell key={headCell.id}
                             align={i ? 'right' : 'left'}
                             sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'desc'}
                      onClick={e => handleSort(e, headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(countryList, getComparator(order, orderBy)).map(country => {
              return (
                <Link href={`/coronavirus/${country.countryKey}`} key={country.name}>
                  <TableRow hover className={classes.countryTableRow}>
                    <TableCell component="th" scope="row">
                      <Link href={`/coronavirus/${country.countryKey}`} key={country.name}>
                        <a>{country.emoji} {country.name}</a>
                      </Link>
                    </TableCell>
                    <TableCell align="right">{country.cases.toLocaleString()}</TableCell>
                    <TableCell align="right">{country.deaths.toLocaleString()}</TableCell>
                    <TableCell align="right">{country.doubling ? `${country.doubling} days` : ''}</TableCell>
                    <TableCell align="right">
                      {country.change && Number.isFinite(country.change) && `${roundDecimals(country.change, 2)}%`}
                    </TableCell>
                  </TableRow>
                </Link>
              )
            })}
          </TableBody>
        </Table>

      </TableContainer>

      <Box mt={3}>
        <Typography variant="body1">
          <a href="/posts/stocks-that-could-benefit-from-the-coronavirus-outbreak-ff13b5bd">
            📈 Stocks that could benefit from the Coronavirus outbreak
          </a>
        </Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="body1">
          <a href="http://partners.etoro.com/B13055_A78726_TClick_Sfs1.aspx" target="_blank"
             rel="nofollow noopener noreferrer">
            📊 Time to buy the dip or time to buy gold? What about oil? Check out this trading app.
          </a>
        </Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="subtitle2">
          Data sources:&nbsp;
          <a href="https://www.ecdc.europa.eu" target="_blank" rel="nofollow noopener noreferrer">ECDC</a>,&nbsp;
          <a href="https://www.who.int" target="_blank" rel="nofollow noopener noreferrer">WHO</a>,&nbsp;
          <a href="https://www.cdc.gov" target="_blank" rel="nofollow noopener noreferrer">CDC</a>
        </Typography>
      </Box>
    </Layout>
  )
}

CoronavirusPage.getInitialProps = async (): Promise<Props> => {
  const casesData = await RedisClient.getAllByPattern('cases_*')
  const cases: { [key: string]: number } = {}
  for (const [key, value] of Object.entries(casesData)) {
    cases[key.slice(6)] = Number(value)
  }
  const deathsData = await RedisClient.getAllByPattern('deaths_*')
  const deaths: { [key: string]: number } = {}
  for (const [key, value] of Object.entries(deathsData)) {
    deaths[key.slice(7)] = Number(value)
  }
  return {
    cases,
    deaths,
  }
}

export default withApollo(CoronavirusPage)
