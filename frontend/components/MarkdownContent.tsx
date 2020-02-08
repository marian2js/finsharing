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
      const youtubeId = props.value.split(':')[1]
      return <Youtube id={youtubeId}/>
    }
    if (props.value.startsWith('twitter:')) {
      const twitterId = props.value.split(':')[1]
      return <TweetEmbed id={twitterId}/>
    }
    if (props.value.startsWith('facebook:')) {
      const facebookId = encodeURIComponent(props.value.split(':')[1])
      return (
        <div className="center-block text-center">
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${facebookId}&width=600&show_text=false&appId=539147866833020&height=336`}
            width="600" height="336" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0"
            allowTransparency={true} allow="encrypted-media" allowFullScreen={true}/>
        </div>
      )
    }
  }

  return createElement('code', props, props.children)
}
