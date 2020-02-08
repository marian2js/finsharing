export type Post = {
  id: string
  user: {
    id: string
    username: string
  }
  title: string
  slug: string
  body: string
  market: {
    id: string
    symbol: string
    name: string
  }
  viewerVote: {
    id: string
    value: string
  }
  votes: number
  numberOfComments: number
  createdAt: string
}
