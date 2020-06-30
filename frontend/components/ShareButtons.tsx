import * as React from 'react'
import { Box, Typography } from '@material-ui/core'

interface OwnProps {
  url: string
  title: string
  cashTag?: string
  size: 'small' | 'large'
}

const ShareButtons = (props: OwnProps) => {
  const { size } = props
  const { Facebook, Reddit, Twitter, Whatsapp } = require('react-social-sharing')
  const divStyle = size === 'large' ? { display: 'inline' } : {}

  return (
    <Box mt={2}>
      <Typography align="center">
        <div style={divStyle}>
          <Whatsapp message={props.title + ' '} link={'\n' + props.url} small={size === 'small'}/>
        </div>
        <div style={divStyle}>
          <Facebook link={props.url} small={size === 'small'}/>
        </div>
        <div style={divStyle}>
          <Twitter message={`${props.title} ${props.cashTag || ''}`.trim()} link={props.url} small={size === 'small'}/>
        </div>
        <div style={divStyle}>
          <Reddit message={props.title} link={props.url} small={size === 'small'}/>
        </div>
      </Typography>
    </Box>
  )
}

export default ShareButtons
