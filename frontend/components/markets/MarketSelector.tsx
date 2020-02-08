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
  onChange?: (value: string) => void
  className?: string
}

const ALL_MARKETS_QUERY = gql`
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

export const MarketSelector = (props: Props) => {
  const classes = useStyles()
  const { label, value, onChange, className } = props
  const [getMarkets, { loading, data }] = useLazyQuery(ALL_MARKETS_QUERY)
  const [market, setMarket] = useState(value || '')

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    getMarkets({
      variables: {
        search: e.target.value.trim()
      }
    })
  }

  const handleMarketSelected = (e: React.ChangeEvent<{}>, market: Market | null) => {
    e.preventDefault()
    if (market) {
      setMarket(market.symbol)
      onChange?.(market.id)
    }
  }

  return (
    <Autocomplete
      className={className === undefined ? classes.selector : className}
      id="market-selector"
      onChange={handleMarketSelected}
      getOptionLabel={market => market.symbol}
      options={data?.markets?.nodes || []}
      loading={loading}
      autoComplete
      includeInputInList
      noOptionsText={market ? 'Market not found' : 'Enter market symbol or name'}
      renderInput={params => (
        <TextField
          {...params}
          label={label || 'Select a market'}
          variant="outlined"
          fullWidth
          onChange={handleFilterChange}
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
    /*<FormControl className={className === undefined ? classes.selector : className}>
      <InputLabel id="market-selector">
        {label || 'Market'}
      </InputLabel>
      <Select
        onChange={e => onChange ? onChange(e.target.value as string) : null}
        value={value || ''}
        labelId="market-selector"
        id="market-selector"
        fullWidth>
        {
          markets.map(market => <MenuItem key={market.id} value={market.id}>{market.name}</MenuItem>)
        }
      </Select>
    </FormControl>*/
  )
}
