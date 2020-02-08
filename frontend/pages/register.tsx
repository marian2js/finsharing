import React, { FormEvent, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { UserService } from '../src/services/UserService'
import { Layout } from '../components/PageLayout/Layout'
import { MessageSnackbar } from '../components/MessageSnackbar'
import Router from 'next/router'
import Head from 'next/head'
import { withApollo } from '../src/apollo'

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

function RegisterPage () {
  const classes = useStyles()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [message, setMessage] = useState()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', severity: 'error' })
      return
    }

    try {
      await new UserService().register({ email, username, password })
      await Router.push('/')
    } catch (e) {
      setMessage({ text: e.message, severity: 'error' })
    }
  }

  return (
    <Layout>
      <Head>
        <title>Sign Up in FinSharing.com</title>
      </Head>

      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"/>

            <TextField
              onChange={e => setUsername(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"/>

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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}>
              Sign Up
            </Button>
          </form>

        </div>
      </Container>

      <MessageSnackbar message={message}/>
    </Layout>
  )
}

export default withApollo(RegisterPage)
