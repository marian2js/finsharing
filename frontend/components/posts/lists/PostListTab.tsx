import React from 'react'
import { createStyles, Tab, Theme, withStyles } from '@material-ui/core'

interface PostListTabProps {
  label: string
}

export const PostListTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#fff',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1,
      },
    },
  }),
)((props: PostListTabProps) => <Tab disableRipple {...props} />)
