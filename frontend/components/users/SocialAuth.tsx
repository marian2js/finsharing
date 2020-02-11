import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { TextDivider } from '../TextDivider'

const useStyles = makeStyles(theme => ({
  socialAuth: {
    textAlign: 'center',
    margin: theme.spacing(3, 0),
    '& a:hover': {
      textDecoration: 'none',
    },
  },
}))

export const SocialAuth = () => {
  const classes = useStyles()
  return (
    <>
      <Grid container justify="center" alignItems="center" className={classes.socialAuth}>
        <Grid item xs>
          <a href="/api/v1/auth/google">
            <Button variant="contained" size="large" startIcon={<FontAwesomeIcon icon={faGoogle}/>}>Google</Button>
          </a>
        </Grid>
        <Grid item xs>
          <a href="/api/v1/auth/facebook">
            <Button variant="contained" size="large" startIcon={<FontAwesomeIcon icon={faFacebookF}/>}>Facebook</Button>
          </a>
        </Grid>
      </Grid>

      <TextDivider><span>OR</span></TextDivider>
    </>
  )
}
