export interface AccessToken {
  accessToken: string
  accessTokenExpiration: number
}

export interface UserTokens extends AccessToken {
  refreshToken?: string
}
