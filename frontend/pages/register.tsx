import React, { FormEvent, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { MessageSnackbar, MessageSnackbarType } from '../components/MessageSnackbar'
import Head from 'next/head'
import { withApollo } from '../src/apollo'
import { SocialAuth } from '../components/users/SocialAuth'
import { Box } from '@material-ui/core'
import { AcceptTermsCheckbox } from '../components/users/AcceptTermsCheckbox'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Router from 'next/router'
import { useLogin } from '../src/services/UserHooks'
import { GoogleAnalyticsService } from '../src/services/GoogleAnalyticsService'
import { TextDivider } from '../components/TextDivider'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(5),
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
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [message, setMessage] = useState<MessageSnackbarType>()
  const [createUser] = useMutation(CREATE_USER_MUTATION)
  const [login] = useLogin()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', severity: 'error' })
      return
    }

    if (!acceptTerms) {
      setMessage({
        text: 'You need to accept the terms and conditions and privacy policy to continue',
        severity: 'error'
      })
      return
    }

    try {
      await createUser({
        variables: {
          email,
          username,
          password,
        }
      })
      await login({
        variables: { username, password }
      })

      GoogleAnalyticsService.sendEvent({
        category: 'user',
        action: 'signup',
        label: 'local',
      })

      await Router.push('/')
    } catch (e) {
      setMessage({ text: e.message, severity: 'error' })
    }
  }

  return (
    <>
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
            <SocialAuth/>
            <TextDivider><span>OR</span></TextDivider>

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

            <Box mt={2}>
              <AcceptTermsCheckbox onChange={() => setAcceptTerms(!acceptTerms)}/>
            </Box>

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
    </>
  )
}

const CREATE_USER_MUTATION = gql`
  mutation CreateUser ($email: String!, $username: String!, $password: String!) {
    createUser(input: { email: $email, username: $username, password: $password }) {
      user {
        id
      }
    }
  }
`

export default withApollo(RegisterPage)
