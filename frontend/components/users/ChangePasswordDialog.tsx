import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  useMediaQuery
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import theme from '../../src/theme'
import { MessageSnackbar, MessageSnackbarType } from '../MessageSnackbar'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

interface Props {
  username: string
  open: boolean
  onClose: () => void
}

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ($username: String!, $password: String!) {
    updateUser (input: { username: $username, password: $password }) {
      user {
        username
        fullName
        email
        website
      }
    }
  }
`

export const ChangePasswordDialog = (props: Props) => {
  const { username, open, onClose } = props
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [message, setMessage] = useState<MessageSnackbarType>()
  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION)

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', severity: 'error' })
      return
    }
    await changePassword({
      variables: {
        username,
        password,
      }
    })
    setMessage({ text: 'Password updated', severity: 'success' })
    onClose()
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="change-password-dialog">

      <DialogTitle id="change-password-dialog">
        <Typography variant="h6">
          Change Password
        </Typography>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handlePasswordChange}>
          <Grid container>
            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handlePasswordChange} color="secondary">
          Update Password
        </Button>
      </DialogActions>

      <MessageSnackbar message={message}/>
    </Dialog>
  )
}
