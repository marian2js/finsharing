import { withApollo } from '../../src/apollo'
import { RedisClient } from '../../src/clients/redis'
import Head from 'next/head'
import { Layout } from '../../components/PageLayout/Layout'
import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { Box, Divider } from '@material-ui/core'
import { countries, Country } from 'countries-list'

interface Props {
  travelRestrictions: { [key: string]: string }
}

function TravelRestrictionsPage (props: Props) {
  const { travelRestrictions } = props

  const title = 'Travel restrictions by country due to COVID-19'
  const description = 'List of travel restrictions imposed by country due to the coronavirus outbreak.'
  const url = 'https://finsharing.com/coronavirus/travel-restrictions'

  const restrictions = (Object.entries(travelRestrictions)
    .map(([key, value]) => {
      const countryKey = key.replace('travel_', '')
      const country = Object.values(countries)
        .find(country => country.name.toLowerCase().replace(/\s/g, '-') === countryKey)
      if (!country) {
        return
      }
      return {
        countryKey,
        country,
        value
      }
    })
    .filter(data => !!data) as { countryKey: string, country: Country, value: string }[])
    .sort((a, b) => a.country.name > b.country.name ? 1 : -1)

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description"
              content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:url" content={url}/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <link rel="canonical" href={url}/>
      </Head>

      <Box mb={6}>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
      </Box>

      <>
        {
          restrictions.map(data => {
            return (
              <div key={data.countryKey}>
                <Box mt={2} mb={2}>
                  <a href={`/coronavirus/${data.countryKey}`}>
                    <Typography variant="h6">
                      {data.country.emoji} {data.country.name}
                    </Typography>
                  </a>
                  <Box mb={2}>
                    <Typography variant="body2">
                      {data.value}
                    </Typography>
                  </Box>
                  <a href={`/coronavirus/${data.countryKey}`}>
                    <Typography variant="subtitle2">
                      See coronavirus stats in {data.country.name}
                    </Typography>
                  </a>
                </Box>
                <Divider/>
              </div>
            )
          })
        }
      </>
    </Layout>
  )
}

TravelRestrictionsPage.getInitialProps = async (): Promise<Props> => {
  return {
    travelRestrictions: await RedisClient.getAllByPattern(`travel_*`)
  }
}

export default withApollo(TravelRestrictionsPage)