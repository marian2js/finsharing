import React, { useState } from 'react'
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import { Market } from '../../src/types/Market'
import gql from 'graphql-tag'
import { Autocomplete } from '@material-ui/lab'
import { useLazyQuery } from '@apollo/react-hooks'

const useStyles = makeStyles(theme => ({
  selector: {
    marginBottom: theme.spacing(1),
  },
}))

interface Props {
  label?: string
  value?: string
  onChange?: (market: Market) => void
  className?: string
  inputClassName?: string
}

const SEARCH_MARKETS_QUERY = gql`
  query Markets ($search: String!) {
    markets (first: 10, search: $search) {
      nodes {
        id
        name
        symbol
      }
    }
  }
`

const POPULAR_MARKETS_QUERY = gql`
  {
    markets (first: 5, orderBy: [{ numberOfPosts: DESC }]) {
      nodes {
        id
        name
        symbol
      }
    }
  }
`

export const MarketSelector = (props: Props) => {
  const classes = useStyles()
  const { label, value, onChange, className, inputClassName } = props
  const [searchMarkets, search] = useLazyQuery(SEARCH_MARKETS_QUERY)
  const [getPopularMarkets, popular] = useLazyQuery(POPULAR_MARKETS_QUERY)
  const [market, setMarket] = useState(value || '')
  const data = search?.data || popular?.data
  const loading = search?.loading || popular?.loading

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchMarkets({
      variables: {
        search: e.target.value.trim()
      }
    })
  }

  const handleOpen = () => {
    getPopularMarkets()
  }

  const handleMarketSelected = (e: React.ChangeEvent<{}>, market: Market | null) => {
    e.preventDefault()
    if (market) {
      setMarket(market.symbol)
      onChange?.(market)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (data?.markets?.nodes?.length) {
        setMarket(data?.markets?.nodes[0].symbol)
        onChange?.(data?.markets?.nodes[0])
      }
    }
  }

  return (
    <Autocomplete
      className={className === undefined ? classes.selector : className}
      id="market-selector"
      onChange={handleMarketSelected}
      onOpen={handleOpen}
      getOptionLabel={market => market.symbol}
      options={data?.markets?.nodes || []}
      loading={loading}
      autoComplete
      includeInputInList
      noOptionsText={'Market not found'}
      renderInput={params => (
        <TextField
          {...params}
          className={inputClassName}
          label={label || 'Select a market'}
          variant="outlined"
          fullWidth
          onChange={handleFilterChange}
          onKeyPress={handleKeyPress}
        />
      )}
      renderOption={(market: Market) => {
        return (
          <Grid container alignItems="center">
            <Grid item xs>
              <span style={{ fontWeight: 400 }}>{market.symbol}</span>
              <Typography variant="body2" color="textSecondary">
                {market.name}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
