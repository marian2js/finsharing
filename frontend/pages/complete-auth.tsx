import React, { FormEvent, useEffect, useState } from 'react'
import { withApollo } from '../src/apollo'
import Head from 'next/head'
import { NextPageContext } from 'next'
import Router from 'next/router'
import { Box, CircularProgress } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { AcceptTermsCheckbox } from '../components/users/AcceptTermsCheckbox'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { MessageSnackbar, MessageSnackbarType } from '../components/MessageSnackbar'
import { useCompleteSocialAuthentication } from '../src/services/UserHooks'

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

interface Props {
  provider: string
  newUser: boolean
  code: string
}

function CompleteAuthPage (props: Props) {
  const classes = useStyles()
  const [username, setUsername] = useState('')
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [message, setMessage] = useState<MessageSnackbarType>()
  const [completeSocialAuthentication] = useCompleteSocialAuthentication()

  useEffect(() => {
    (async () => {
      if (!props.newUser) {
        await completeSocialAuthentication({
          variables: {
            provider: props.provider,
            code: props.code
          }
        })
        await Router.push('/')
      }
    })()
  }, [])

  const handleUsernameSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!acceptTerms) {
      setMessage({
        text: 'You need to accept the terms and conditions and privacy policy to continue',
        severity: 'error'
      })
      return
    }

    await completeSocialAuthentication({
      variables: {
        username,
        provider: props.provider,
        code: props.code
      }
    })
    await Router.push('/')
  }

  const renderSelectUsername = () => {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Typography component="h1" variant="h5">
          Complete sign up
        </Typography>
        <form className={classes.form} onSubmit={handleUsernameSubmit}>
          <TextField
            onChange={e => setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Choose an username"
            name="username"/>

          <Box mt={2}>
            <AcceptTermsCheckbox onChange={() => setAcceptTerms(!acceptTerms)}/>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign In
          </Button>
        </form>

        <MessageSnackbar message={message}/>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>Complete Sign Up</title>
      </Head>

      {
        props.newUser ? renderSelectUsername() : <CircularProgress/>
      }
    </>
  )
}

CompleteAuthPage.getInitialProps = (ctx: NextPageContext): Props => ({
  provider: (ctx.query.provider || '').toString(),
  newUser: ctx.query.newUser === 'true',
  code: (ctx.query.code || '').toString(),
})

export default withApollo(CompleteAuthPage)
