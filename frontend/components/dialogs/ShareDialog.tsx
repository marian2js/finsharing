import React from 'react'
import { createStyles, Dialog, DialogContent, IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import ShareButtons from '../ShareButtons'

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
  title?: string
  open: boolean
  onClose: () => void
  shareUrl: string
  shareTitle: string
  shareCashTag?: string
}

export const ShareDialog = (props: Props) => {
  const classes = useStyles()
  const { title, open, onClose, shareUrl, shareTitle, shareCashTag } = props

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="exit-dialog">

      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">{title || 'Share Post'}</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon/>
        </IconButton>
      </MuiDialogTitle>

      <DialogContent>
        <ShareButtons url={shareUrl} title={shareTitle} cashTag={shareCashTag} size="large"/>
      </DialogContent>
    </Dialog>
  )
}
