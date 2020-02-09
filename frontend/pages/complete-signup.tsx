import React, { useEffect } from 'react'
import { withApollo } from '../src/apollo'
import Head from 'next/head'
import { CircularProgress } from '@material-ui/core'
import { NextPageContext } from 'next'
import { UserService } from '../src/services/UserService'
import Router from 'next/router'
import { Layout } from '../components/PageLayout/Layout'

interface Props {
  username: string
  code: string
}

const CompleteSignUpPage = (props: Props) => {
  const { username, code } = props

  useEffect(() => {
    (async () => {
      await new UserService().verify({
        username,
        code,
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
