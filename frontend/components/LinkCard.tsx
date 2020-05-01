import React from 'react'
import { Box, Card, CardContent, CardMedia, createStyles, Theme, Typography, useMediaQuery } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { parseUrl } from '../src/utils/string'
import theme from '../src/theme'
import LinkIcon from '@material-ui/icons/Link'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
    },
    link: {
      '&:hover': {
        textDecoration: 'none',
      }
    },
    details: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#2b2b2b',
    },
    content: {
      flex: '1 0 auto',
    },
    image: {
      width: 151,
    },
    linkText: {
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        textDecoration: 'underline',
      }
    },
    linkIcon: {
      marginRight: theme.spacing(1),
    },
  })
)

interface Props {
  title?: string
  link?: string
  image?: string
  description?: string
}

export const LinkCard = (props: Props) => {
  const classes = useStyles()
  const { title, description } = props
  const parsedLink = props.link && parseUrl(props.link)
  const parsedImage = props.image && parseUrl(props.image)

  // xs screens show the image at the top of the card, larger screens do it at the right
  const showImageOnTop = useMediaQuery(theme.breakpoints.down('xs'))

  const cardContent = (
    <Card className={classes.card}>
      <div className={classes.details}>
        {
          showImageOnTop && parsedImage && (
            <CardMedia
              component="img"
              image={parsedImage}
              title={title || ''}
            />
          )
        }

        <CardContent className={classes.content}>
          {
            title && (
              <Typography variant="h5">
                {title}
              </Typography>
            )
          }
          {
            description && (
              <Box mt={title ? 1 : 0}>
                <Typography variant="subtitle1">
                  {description}
                </Typography>
              </Box>
            )
          }
          {
            parsedLink && (
              <Box mt={2}>
                <Typography variant="subtitle2" color="primary" className={classes.linkText}>
                  <LinkIcon className={classes.linkIcon} fontSize="small"/> {parsedLink}
                </Typography>
              </Box>
            )
          }
        </CardContent>
      </div>
      {
        !showImageOnTop && parsedImage && (
          <CardMedia
            className={classes.image}
            image={parsedImage}
            title={title || ''}
          />
        )
      }
    </Card>
  )

  return (
    <Box mb={2}>
      {
        parsedLink ?
          <a href={parsedLink} target="_blank" rel="nofollow noopener noreferrer" className={classes.link}>
            {cardContent}
          </a> : cardContent
      }
    </Box>
  )
}
