import * as React from 'react'
import { createElement } from 'react'
import ReactMarkdown, { MarkdownAbstractSyntaxTree } from 'react-markdown'
import TweetEmbed from 'react-tweet-embed'
import { makeStyles } from '@material-ui/core'
import { Youtube } from './YouTube'

const useStyles = makeStyles({
  markdown: {
    '& p:last-child': {
      marginBottom: 0
    },
    '& img': {
      width: '100%'
    }
  },
})

interface Props {
  content: string
  className?: string
}

export const MarkdownContent = (props: Props) => {
  const classes = useStyles()
  const content = props.content

  return (
    <ReactMarkdown className={`${props.className || ''} ${classes.markdown}`}
                   source={content}
                   linkTarget={(url) => url.startsWith('http') ? '_blank' : '_self'}
                   renderers={{
                     inlineCode: InlineCode
                   }}/>
  )
}

function InlineCode (props: MarkdownAbstractSyntaxTree) {
  if (props.value) {
    if (props.value.startsWith('youtube:')) {
      const youtubeId = props.value.split(':')[1].trim()
      return <Youtube id={youtubeId}/>
    }
    if (props.value.startsWith('twitter:')) {
      const twitterId = props.value.split(':')[1].trim()
      return <TweetEmbed id={twitterId}/>
    }
    if (props.value.startsWith('facebook:')) {
      const facebookId = encodeURIComponent(props.value.split(':')[1].trim())
      return (
        <div className="center-block text-center">
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${facebookId}&width=600&show_text=false&appId=873138313118981&height=336`}
            width="600" height="336" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0"
            allowTransparency={true} allow="encrypted-media" allowFullScreen={true}/>
        </div>
      )
    }
    if (props.value.startsWith('yahoofinancevideo:')) {
      const id = props.value.split('yahoofinancevideo:')[1].trim()
      const url = /^https:\/\/finance.yahoo.com\/video\//.test(id) ? id : `https://finance.yahoo.com/video/${id}`
      return (
        <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%' }}>
          <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  width="100%" height="100%" scrolling='no' frameBorder='0'
                  src={`${url}?format=embed&recommendations=false`}
                  allowFullScreen={true} allowTransparency={true}
                  allow='autoplay; fullscreen; encrypted-media'/>
        </div>
      )
    }
  }

  return createElement('code', props, props.children)
}
