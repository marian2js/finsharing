import * as React from 'react'
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
  TableRow
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { countries } from 'countries-list'
import Link from 'next/link'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  countryTableRow: {
    cursor: 'pointer',
  },
})

interface Props {
  cases: { [key: string]: number }
  deaths: { [key: string]: number }
}

function CoronavirusPage (props: Props) {
  const classes = useStyles()
  const { cases, deaths } = props

  const countryList = Object.values(countries).sort((a, b) => a.name > b.name ? 1 : -1)

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

      <TableContainer component={Paper}>
        <Table aria-label="country table">
          <TableHead>
            <TableRow>
              <TableCell>Country</TableCell>
              <TableCell align="right">Total cases</TableCell>
              <TableCell align="right">Total deaths</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countryList.map(country => {
              const countryKey = country.name.toLowerCase().replace(/\s/g, '-')
              return (
                <Link href={`/coronavirus/${countryKey}`} key={country.name}>
                  <TableRow hover className={classes.countryTableRow}>
                    <TableCell component="th" scope="row">
                      <Link href={`/coronavirus/${countryKey}`} key={country.name}>
                        <a>{country.emoji} {country.name}</a>
                      </Link>
                    </TableCell>
                    <TableCell align="right">{(cases[countryKey] || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">{(deaths[countryKey] || 0).toLocaleString()}</TableCell>
                  </TableRow>
                </Link>
              )
            })}
          </TableBody>
        </Table>

      </TableContainer>

      <Box mt={3}>
        <Typography variant="subtitle2">
          Data source: <a href="https://www.ecdc.europa.eu" target="_blank" rel="nofollow noopener noreferrer">ECDC</a>
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
