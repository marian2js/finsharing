import React from 'react'
import { withApollo } from '../../src/apollo'
import { Layout } from '../../components/PageLayout/Layout'
import Head from 'next/head'
import { Card, CardContent } from '@material-ui/core'

const CookiePolicyPage = () => {
  return (
    <Layout>
      <Head>
        <title>Cookie Policy - FinSharing.com</title>
      </Head>

      <Card>
        <CardContent>
          <section>
            <h1>Cookie Policy for FinSharing.com</h1>

            <p>This is the Cookie Policy for FinSharing.com, accessible from https://finsharing.com</p>

            <p><strong>What Are Cookies</strong></p>

            <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files
              that
              are downloaded to your computer, to improve your experience. This page describes what information they
              gather,
              how we use it and why we sometimes need to store these cookies. We will also share how you can prevent
              these
              cookies from being stored however this may downgrade or 'break' certain elements of the sites
              functionality.</p>

            <p>For more general information on cookies see the Wikipedia article on HTTP Cookies.</p>

            <p><strong>How We Use Cookies</strong></p>

            <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry
              standard options for disabling cookies without completely disabling the functionality and features they
              add to
              this site. It is recommended that you leave on all cookies if you are not sure whether you need them or
              not in
              case they are used to provide a service that you use.</p>

            <p><strong>Disabling Cookies</strong></p>

            <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help
              for
              how to do this). Be aware that disabling cookies will affect the functionality of this and many other
              websites
              that you visit. Disabling cookies will usually result in also disabling certain functionality and features
              of
              the this site. Therefore it is recommended that you do not disable cookies.</p>

            <p><strong>The Cookies We Set</strong></p>

            <ul>

              <li>
                <p>Account related cookies</p>
                <p>If you create an account with us then we will use cookies for the management of the signup process
                  and
                  general administration. These cookies will usually be deleted when you log out however in some cases
                  they
                  may remain afterwards to remember your site preferences when logged out.</p>
              </li>

              <li>
                <p>Login related cookies</p>
                <p>We use cookies when you are logged in so that we can remember this fact. This prevents you from
                  having to
                  log in every single time you visit a new page. These cookies are typically removed or cleared when you
                  log
                  out to ensure that you can only access restricted features and areas when logged in.</p>
              </li>

              <li>
                <p>Email newsletters related cookies</p>
                <p>This site offers newsletter or email subscription services and cookies may be used to remember if you
                  are
                  already registered and whether to show certain notifications which might only be valid to
                  subscribed/unsubscribed users.</p>
              </li>


              <li>
                <p>Forms related cookies</p>
                <p>When you submit data to through a form such as those found on contact pages or comment forms cookies
                  may
                  be set to remember your user details for future correspondence.</p>
              </li>

              <li>
                <p>Site preferences cookies</p>
                <p>In order to provide you with a great experience on this site we provide the functionality to set your
                  preferences for how this site runs when you use it. In order to remember your preferences we need to
                  set
                  cookies so that this information can be called whenever you interact with a page is affected by your
                  preferences.</p>
              </li>

            </ul>

            <p><strong>Third Party Cookies</strong></p>

            <p>In some special cases we also use cookies provided by trusted third parties. The following section
              details
              which third party cookies you might encounter through this site.</p>

            <ul>

              <li>
                <p>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on
                  the
                  web for helping us to understand how you use the site and ways that we can improve your experience.
                  These
                  cookies may track things such as how long you spend on the site and the pages that you visit so we can
                  continue to produce engaging content.</p>
                <p>For more information on Google Analytics cookies, see the official Google Analytics page.</p>
              </li>

              <li>
                <p>Third party analytics are used to track and measure usage of this site so that we can continue to
                  produce
                  engaging content. These cookies may track things such as how long you spend on the site or pages you
                  visit
                  which helps us to understand how we can improve the site for you.</p>
              </li>

              <li>
                <p>From time to time we test new features and make subtle changes to the way that the site is delivered.
                  When we are still testing new features these cookies may be used to ensure that you receive a
                  consistent
                  experience whilst on the site whilst ensuring we understand which optimisations our users appreciate
                  the
                  most.</p>
              </li>

              <li>
                <p>As we sell products it's important for us to understand statistics about how many of the visitors to
                  our
                  site actually make a purchase and as such this is the kind of data that these cookies will track. This
                  is
                  important to you as it means that we can accurately make business predictions that allow us to monitor
                  our
                  advertising and product costs to ensure the best possible price.</p>
              </li>

              <li>
                <p>The Google AdSense service we use to serve advertising uses a DoubleClick cookie to serve more
                  relevant
                  ads across the web and limit the number of times that a given ad is shown to you.</p>
                <p>For more information on Google AdSense see the official Google AdSense privacy FAQ.</p>
              </li>


              <li>
                <p>We also use social media buttons and/or plugins on this site that allow you to connect with your
                  social
                  network in various ways. For these to work the following social media sites
                  including; &#123;List the social networks whose features you have integrated with your site?:12&#125;,
                  will set
                  cookies through our site which may be used to enhance your profile on their site or contribute to the
                  data
                  they hold for various purposes outlined in their respective privacy policies.</p>
              </li>

            </ul>

            <p><strong>More Information</strong></p>

            <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that
              you
              aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact
              with
              one of the features you use on our site. This Cookies Policy was created with the help of the <a
                href="https://www.cookiepolicygenerator.com">Cookies Policy Template Generator</a> and the <a
                href="https://www.webterms.org">WebTerms Generator</a>.</p>

            <p>However if you are still looking for more information then you can contact us through one of our
              preferred
              contact methods:</p>

            <ul>
              <li>Email: admin@finsharing.com</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </Layout>
  )
}

export default withApollo(CookiePolicyPage)
