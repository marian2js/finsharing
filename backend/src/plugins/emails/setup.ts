import { EmailModule } from '@commun/emails'
import aws from 'aws-sdk'
import nodemailer from 'nodemailer'

export default async function () {
  await EmailModule.setup({
    ...require('./config.json'),
    transporter: nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01'
      })
    })
  })
}
