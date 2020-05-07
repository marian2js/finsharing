import React, { useEffect, useState } from 'react'
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  makeStyles,
  TextField,
  useMediaQuery
} from '@material-ui/core'
import theme from '../../src/theme'
import { getMarkdownForLink } from '../../src/utils/markdown'
import { MessageSnackbar, MessageSnackbarType } from '../MessageSnackbar'

const useStyles = makeStyles({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
})

interface Props {
  open: boolean
  includeCardTitle: boolean
  onCancel: () => void
  onLinkShared: (link: { markdown: string, title?: string, image?: string }) => void
}

export const ShareLinkDialog = (props: Props) => {
  const classes = useStyles()
  const { open, onCancel, onLinkShared } = props
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageSnackbarType>()
  const [includeCardTitle, setIncludeCardTitle] = useState(props.includeCardTitle)

  useEffect(() => {
    setIncludeCardTitle(props.includeCardTitle)
  }, [props.includeCardTitle])

  const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleContinueClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!link) {
      return
    }
    setLoading(true)
    const markdownData = await getMarkdownForLink(link, includeCardTitle)
    if (markdownData?.markdown) {
      onLinkShared(markdownData)
    } else {
      setMessage({ text: 'The URL cannot be loaded at the moment.', severity: 'error' })
    }
    setLoading(false)
    setLink('')
  }

  return (
    <Dialog
      fullWidth={true}
      fullScreen={smDownScreen}
      open={open}
      onClose={onCancel}
      aria-labelledby="share-link-dialog">

      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              label="Link"
              onChange={e => setLink(e.target.value)}
              value={link}
              required
              name="link"
              variant="outlined"
              margin="normal"
              autoFocus
              fullWidth/>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="default">
          Cancel
        </Button>
        <Button onClick={handleContinueClick} color="primary">
          Continue
        </Button>
      </DialogActions>

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit"/>
      </Backdrop>

      <MessageSnackbar message={message}/>
    </Dialog>
  )
}
