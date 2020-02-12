import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { parseUrl } from '../src/utils/string'

const useStyles = makeStyles({
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
  hoverUnderline: {
    '&:hover': {
      textDecoration: 'underline',
    }
  },
})

interface Props {
  title?: string
  link?: string
  image?: string
}

export const LinkCard = (props: Props) => {
  const classes = useStyles()
  const { title } = props
  const parsedLink = props.link && parseUrl(props.link)
  const parsedImage = props.image && parseUrl(props.image)

  const cardContent = (
    <Card className={classes.card}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          {
            title && (
              <Typography variant="h5" className={parsedLink ? classes.hoverUnderline : ''}>
                {title}
              </Typography>
            )
          }
          {
            parsedLink && (
              <Typography variant="subtitle1" color="primary" className={parsedLink ? classes.hoverUnderline : ''}>
                {parsedLink}
              </Typography>
            )
          }
        </CardContent>
      </div>
      {
        parsedImage && (
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
