import React, { createContext, useState } from 'react'
import { User } from '../../src/types/User'

export const ViewerContext = createContext<{ viewer: User | null, setViewer: any }>({ viewer: null, setViewer: null })

interface Props {
  viewer?: User | null
  children: JSX.Element[] | JSX.Element
}

const ViewerContextProvider = (props: Props) => {
  const [viewer, setViewer] = useState<User | null>(props.viewer || null)
  return (
    <ViewerContext.Provider value={{ viewer, setViewer }}>
      {props.children}
    </ViewerContext.Provider>
  )
}

export default ViewerContextProvider
