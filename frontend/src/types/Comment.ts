export type Comment = {
  id: string
  user: { id: string, username?: string }
  body: string
  createdAt: string
}
