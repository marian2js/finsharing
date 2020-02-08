export type User = {
  id: string
  username: string
  email: string
  password?: string
  verified: boolean
  refreshTokenHash?: string
  verificationCode?: string
  resetPasswordCodeHash?: string
  admin?: boolean
  providers?: {
    [key: string]: {
      id: string
    }
  }
  fullName: string
  website: string
  numberOfPosts: number
  numberOfComments: number
}
