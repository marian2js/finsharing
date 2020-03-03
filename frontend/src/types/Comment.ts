export type Comment = {
  id: string
  user: { id: string, username?: string }
  body: string
  votes: number
  viewerVote: {
    id: string
    value: string
  }
  createdAt: string
}
