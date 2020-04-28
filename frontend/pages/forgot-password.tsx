import React, { FormEvent, useState } from 'react'
import { withApollo } from '../src/apollo'
import Head from 'next/head'
import TextField from '@material-ui/core/TextField'
import { Button, Card, CardContent, Grid, makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { MessageSnackbar } from '../components/MessageSnackbar'
import { useSendResetPasswordEmail } from '../src/services/UserHooks'

const useStyles = makeStyles(theme => ({
  submitButton: {
    float: 'right',
    margin: theme.spacing(3, 0),
  },
}))

const ForgotPasswordPage = () => {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState()
  const [sendResetPasswordEmail] = useSendResetPasswordEmail()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await sendResetPasswordEmail({
        variables: { username: email }
      })
      setMessage({ text: 'Reset password email sent', severity: 'success' })
    } catch (e) {
      setMessage({ text: e.message, severity: 'error' })
    }
  }

  return (
    <>
      <Head>
        <title>Reset your password</title>
      </Head>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Typography component="h1" variant="h5">
                Reset your password
              </Typography>

              <Grid item xs={12}>
                <TextField
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus/>
              </Grid>

              <Grid item xs={12} className={classes.submitButton}>
                <Button type="submit" size="large" variant="contained" color="primary">
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <MessageSnackbar message={message}/>
    </>
  )
}

export default withApollo(ForgotPasswordPage)
