import React from 'react'
import TweetEmbed from 'react-tweet-embed'
import { NoSsr, useMediaQuery } from '@material-ui/core'
import theme from '../../src/theme'

interface Props {
  id: string
}

export const TweetEmbedBody = (props: Props) => {
  const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <NoSsr>
      <div>
        <TweetEmbed id={props.id} options={{ theme: 'dark', width: smDownScreen ? 250 : 500 }}/>
      </div>
    </NoSsr>
  )
}
