import React, { FormEvent, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { MessageSnackbar } from '../components/MessageSnackbar'
import { Layout } from '../components/PageLayout/Layout'
import { UserService } from '../src/services/UserService'
import Router from 'next/router'
import Head from 'next/head'
import { withApollo } from '../src/apollo'
import Link from 'next/link'
import { Box } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

function LoginPage () {
  const classes = useStyles()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await new UserService().login({ username, password })
      await Router.push('/')
    } catch (e) {
      setMessage({ text: e.message, severity: 'error' })
    }
  }

  return (
    <Layout>
      <Head>
        <title>Sign In in FinSharing.com</title>
      </Head>

      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              onChange={e => setUsername(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username or Email Address"
              name="email"
              autoComplete="email"
              autoFocus/>

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
              autoComplete="current-password"/>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}>
              Sign In
            </Button>
          </form>

          <Typography variant="body2" align="center" component="p">
            New to FinSharing.com? <Link href="/register"><a>Sign Up</a></Link>
          </Typography>
          <Box mt={1}>
            <Typography variant="body2" align="center" component="p">
              Forgot your password? <Link href="/forgot-password"><a>Reset it now</a></Link>
            </Typography>
          </Box>

        </div>
      </Container>

      <MessageSnackbar message={message}/>
    </Layout>
  )
}

export default withApollo(LoginPage)
