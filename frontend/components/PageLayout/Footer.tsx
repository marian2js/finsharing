import React from 'react'
import { Box, makeStyles, Typography, useMediaQuery } from '@material-ui/core'
import theme from '../../src/theme'
import { drawerWidth } from './SideMenu'
import Link from 'next/link'
import TwitterIcon from '@material-ui/icons/Twitter'

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
  },
  footerSmallScreenUp: {
    marginLeft: `${drawerWidth}px`
  },
}))

export const Footer = () => {
  const classes = useStyles()

  const smUp = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <footer className={`${classes.footer} ${smUp && classes.footerSmallScreenUp}`}>
      <a href="https://twitter.com/finsharing" target="_blank">
        <Typography variant="h6" align="center" gutterBottom>
          <TwitterIcon/>
        </Typography>
      </a>

      <Typography variant="subtitle2" align="center" color="textSecondary" component="p">
        <a href="https://github.com/marian2js/finsharing" target="_blank">Open Source</a> project
        powered by <a href="https://github.com/commundev/commun" target="_blank">Commun</a>
      </Typography>

      <Box mt={2} mb={2}>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          <a href="mailto:admin@finsharing.com">Contact Us</a> |
          &nbsp;<Link href="/legal/risk-warning"><a>Risk Warning</a></Link> |
          &nbsp;<Link href="/legal/privacy-policy"><a>Privacy Policy</a></Link> |
          &nbsp;<Link href="/legal/cookie-policy"><a>Cookie Policy</a></Link> |
          &nbsp;<Link href="/legal/terms"><a>Terms and Conditions</a></Link>
        </Typography>
      </Box>

      <Typography variant="body2" align="center" color="textSecondary" component="p">
        <strong>Disclaimer</strong>: FinSharing does not guarantee that any of the information available on our website,
        APIs or provided by any other means is complete, accurate, current, reliable or appropriate for your needs. Some
        of our information is provided by third party services and we cannot guarantee that is complete, accurate,
        current, reliable or appropriate for your needs. The information and recommendations on this site are for
        educational purposes only and should not be used to replace the advice of financial advisors and other
        professionals. All our services, information, data and/or recommendations are provided on an "as is" basis and
        without warranties of any kind, either express or implied. We do not guarantee that our services, information,
        data and/or recommendations are complete, accurate, current, reliable or appropriate for your needs.

        Read more
      </Typography>
    </footer>
  )
}
