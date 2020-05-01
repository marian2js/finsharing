import * as React from 'react'
import { createElement } from 'react'
import ReactMarkdown, { MarkdownAbstractSyntaxTree } from 'react-markdown'
import TweetEmbed from 'react-tweet-embed'
import { makeStyles } from '@material-ui/core'
import { Youtube } from './YouTube'
import { LinkCard } from './LinkCard'
import { GoogleTrends } from './charts/GoogleTrends'

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
                     inlineCode: InlineCode,
                     code: CodeBlock,
                   }}/>
  )
}

function InlineCode (props: MarkdownAbstractSyntaxTree) {
  if (props.value) {
    if (props.value.toLowerCase().startsWith('youtube:')) {
      const youtubeId = props.value.split(':')[1].trim()
      return <Youtube id={youtubeId}/>
    }
    if (props.value.toLowerCase().startsWith('twitter:')) {
      const twitterId = props.value.split(':')[1].trim()
      return <TweetEmbed id={twitterId}/>
    }
    if (props.value.toLowerCase().startsWith('facebook:')) {
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
    if (props.value.toLowerCase().startsWith('yahoofinancevideo:')) {
      const id = props.value.toLowerCase().split('yahoofinancevideo:')[1].trim()
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
    if (props.value.toLowerCase().startsWith('googletrends:')) {
      const url = props.value.toLowerCase().split('googletrends:')[1].trim()
      return <GoogleTrends url={url}/>
    }
  }

  return createElement('code', props, props.children)
}

function CodeBlock (props: { language: string, value: string }) {
  if (props.language.trim() === 'card') {
    const lines = props.value.split('\n').map(line => line.trim())
    const titleLine = lines.find(line => line.toLowerCase().startsWith('title='))
    const imageLine = lines.find(line => line.toLowerCase().startsWith('image='))
    const linkLine = lines.find(line => line.toLowerCase().startsWith('link='))
    const descriptionLine = lines.find(summary => summary.toLowerCase().startsWith('description='))
    const title = titleLine?.split('=').slice(1).join('=')
    const image = imageLine?.split('=').slice(1).join('=')
    const link = linkLine?.split('=').slice(1).join('=')
    const description = descriptionLine?.split('=').slice(1).join('=')
    if (title || image || link) {
      return <LinkCard title={title} image={image} link={link} description={description}/>
    }
  }

  const className = props.language && `language-${props.language}`
  const code = createElement('code', className ? { className: className } : null, props.value)
  return createElement('pre', props, code)
}
