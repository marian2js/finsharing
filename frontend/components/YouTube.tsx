import * as React from 'react'

interface OwnProps {
  id: string
}

export const Youtube = (props: OwnProps) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%' }}>
      <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              width="100%" height="100%" src={'https://www.youtube.com/embed/' + props.id} frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
    </div>
  )
}
