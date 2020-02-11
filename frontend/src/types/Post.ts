import { Market } from './Market'
import { User } from './User'

export type Post = {
  id: string
  user: User
  title: string
  slug: string
  body: string
  smImageUrl: string
  lgImageUrl: string
  market: Market
  viewerVote: {
    id: string
    value: string
  }
  votes: number
  numberOfComments: number
  createdAt: string
}
