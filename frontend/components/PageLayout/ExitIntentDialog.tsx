import React from 'react'
import {
  createStyles,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery
} from '@material-ui/core'
import theme from '../../src/theme'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import { TextDivider } from '../TextDivider'
import { SocialAuth } from '../users/SocialAuth'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
)

interface Props {
  open: boolean
  onClose: () => void
}

export const ExitIntentDialog = (props: Props) => {
  const classes = useStyles()
  const { open, onClose } = props
  const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="exit-dialog">

      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">Thanks for visiting FinSharing.com!</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon/>
        </IconButton>
      </MuiDialogTitle>

      <DialogContent>
        <Typography variant="subtitle1">
          FinSharing is the best community for Stock Market discussions, ideas and investment strategies.
        </Typography>

        <TextDivider><span>Join now <strong>for free</strong> and stay ahead of the markets</span></TextDivider>

        <SocialAuth showEmail={!smDownScreen}/>
      </DialogContent>
    </Dialog>
  )
}
