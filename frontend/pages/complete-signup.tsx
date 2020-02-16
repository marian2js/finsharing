import React, { useEffect } from 'react'
import { withApollo } from '../src/apollo'
import Head from 'next/head'
import { CircularProgress } from '@material-ui/core'
import { NextPageContext } from 'next'
import Router from 'next/router'
import { Layout } from '../components/PageLayout/Layout'
import { useVerifyEmail } from '../src/services/UserHooks'

interface Props {
  username: string
  code: string
}

const CompleteSignUpPage = (props: Props) => {
  const { username, code } = props
  const [verifyEmail] = useVerifyEmail()

  useEffect(() => {
    (async () => {
      await verifyEmail({
        variables: {
          username,
          code,
        }
      })
      await Router.push('/')
    })()
  }, [])

  return (
    <Layout>
      <Head>
        <title>Complete Sign Up</title>
      </Head>
      <CircularProgress/>
    </Layout>
  )
}

CompleteSignUpPage.getInitialProps = (ctx: NextPageContext) => {
  return {
    username: (ctx.query.username || '').toString(),
    code: (ctx.query.code || '').toString(),
  }
}

export default withApollo(CompleteSignUpPage)
