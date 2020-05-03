import * as React from 'react'
import { Box, Typography } from '@material-ui/core'

interface OwnProps {
  url: string
  title: string
  cashTag?: string
}

const ShareButtons = (props: OwnProps) => {
  const { Facebook, Reddit, Twitter, Whatsapp } = require('react-social-sharing')

  return (
    <Box mt={2}>
      <Typography align="center">
        <div>
          <Whatsapp message={props.title + ' '} link={'\n' + props.url} small/>
        </div>
        <div>
          <Facebook link={props.url} small/>
        </div>
        <div>
          <Twitter message={`${props.title} ${props.cashTag || ''}`.trim()} link={props.url} small/>
        </div>
        <div>
          <Reddit message={props.title} link={props.url} small/>
        </div>
      </Typography>
    </Box>
  )
}

export default ShareButtons
