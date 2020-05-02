import React, { FormEvent, useState } from 'react'
import { withApollo } from '../src/apollo'
import Head from 'next/head'
import { Button, Card, CardContent, Grid, makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { NextPageContext } from 'next'
import Router from 'next/router'
import { useLogin, useResetPassword } from '../src/services/UserHooks'
import { MessageSnackbar, MessageSnackbarType } from '../components/MessageSnackbar'

const useStyles = makeStyles(theme => ({
  submitButton: {
    float: 'right',
    margin: theme.spacing(3, 0),
  },
}))

interface Props {
  code: string
  username: string
}

const ResetPasswordPage = (props: Props) => {
  const classes = useStyles()
  const { username, code } = props
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<MessageSnackbarType>()
  const [login] = useLogin()
  const [resetPassword] = useResetPassword()

  const formValid = () => {
    return password && password === confirmPassword
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formValid()) {
      return
    }

    try {
      await resetPassword({
        variables: {
          password,
          username,
          code,
        }
      })
      await login({
        variables: { username, password }
      })
      setMessage({ text: 'Password successfully changed', severity: 'success' })
      await Router.push('/')
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
              <Grid item xs={12}>
                <TextField
                  onChange={e => setPassword(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"/>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  onChange={e => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"/>
              </Grid>
            </Grid>

            <Grid item xs={12} className={classes.submitButton}>
              <Button type="submit" size="large" variant="contained" color="primary" disabled={!formValid()}>
                Set new password
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <MessageSnackbar message={message}/>
    </>
  )
}

ResetPasswordPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  return {
    code: Array.isArray(ctx.query.code) ? ctx.query.code[0] : ctx.query.code,
    username: Array.isArray(ctx.query.username) ? ctx.query.username[0] : ctx.query.username,
  }
}

export default withApollo(ResetPasswordPage)
