import React from 'react'
import { withApollo } from '../../src/apollo'
import Head from 'next/head'
import { Card, CardContent } from '@material-ui/core'

const RiskWarningPage = () => {
  return (
    <>
      <Head>
        <title>Risk Warning - FinSharing.com</title>
      </Head>

      <Card>
        <CardContent>
          <section>
            <h1>Risk Warning</h1>

            <p>
              Trading in financial instruments and/or cryptocurrencies carries a high level of risk including the risk
              of losing some, or all, of your investment amount. You should seek advice from an independent and suitably
              licensed financial advisor and ensure that you have the risk appetite, relevant experience and knowledge
              before
              you decide to trade. Under no circumstances shall we have any liability for (a) any loss or damage in
              whole or
              part caused by, resulting from, or relating to any trade or investment or (b) any direct, indirect,
              special, consequential or incidental damages whatsoever.
              The possibility exists that you could sustain a loss in excess of your initial investment. You should be
              aware
              of all the risks associated with trading and seek advice from an independent financial advisor.
            </p>

            <p>
              FinSharing does not guarantee that any of the information available on our website, APIs or provided
              by any
              other means is complete, accurate, current, reliable or appropriate for your needs. Some of our
              information is
              provided by third party services and we cannot guarantee that is complete, accurate, current, reliable or
              appropriate for your needs.
            </p>
            <p>
              The information and recommendations on this site are for educational purposes only and should not be used
              to
              replace the advice of financial advisors and other professionals.
            </p>
            <p>
              All our services, information, data and/or recommendations are provided on an "as is" basis and without
              warranties of any kind, either express or implied.
              We do not guarantee that our services, information, data and/or recommendations are complete, accurate,
              current, reliable or appropriate for your needs.
            </p>
            <p>
              The intent of our website is not to replace specific and/or targeted professional advice. The user
              is solely responsible for any effects as a result of investing based on the information provided here.
            </p>
            <p>
              Decisions to buy, sell, hold or trade securities, commodities and/or any other assets involve risk of
              substantial losses. Any investment decisions are best made based on the advice of qualified professionals.
              Before trading securities, commodities and/or other assets you should seek advice from a qualified
              professional.
            </p>

            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and
              conditions
              relating to our website and the use of this website. Nothing in this disclaimer will:
            </p>

            <ul>
              <li>limit or exclude our or your liability for death or personal injury;</li>
              <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
              <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
              <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
            </ul>

            <p>
              The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a)
              are
              subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including
              liabilities arising in contract, in tort and for breach of statutory duty.
            </p>

          </section>
        </CardContent>
      </Card>
    </>
  )
}

export default withApollo(RiskWarningPage)
