import React from 'react'
import Typography from '@material-ui/core/Typography'
import { Box } from '@material-ui/core'

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

export function tabProps (index: number, idPrefix: string = 'tab') {
  return {
    id: `${idPrefix}-${index}`,
    'aria-controls': `${idPrefix}-${index}`,
  }
}

export function TabPanel (props: TabPanelProps, idPrefix: string = 'tab') {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`${idPrefix}-${index}`}
      aria-labelledby={`${idPrefix}-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}
