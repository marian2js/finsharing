export const PARTNER_URL = 'http://partners.etoro.com/aw.aspx?B=8219&A=78726&Task=Click&TargetURL=https%3a%2f%2fwww.etoro.com'

export const getPartnerLink = (partnerId: string): string => {
  return PARTNER_URL + '%2fmarkets%2f' + partnerId.toLocaleLowerCase()
}
