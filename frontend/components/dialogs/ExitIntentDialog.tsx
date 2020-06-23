import React from 'react'
import { SignUpDialog } from './SignUpDialog'

interface Props {
  open: boolean
  onClose: () => void
}

export const ExitIntentDialog = (props: Props) =>
  <SignUpDialog title="Thanks for visiting FinSharing.com!" open={props.open} onClose={props.onClose}/>

export const ExitIntentDialogSkipPaths = [
  '/login',
  '/register',
  '/complete-signup',
  '/complete-auth',
  '/forgot-password',
  '/reset-password',
]
