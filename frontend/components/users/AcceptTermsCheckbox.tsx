import React, { useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core'
import Link from 'next/link'

interface Props {
  onChange: (acceptTerms: boolean) => void
}

export const AcceptTermsCheckbox = (props: Props) => {
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)

  const handleChange = () => {
    props.onChange(!acceptTerms)
    setAcceptTerms(!acceptTerms)
  }

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={acceptTerms} onChange={handleChange}/>}
          label={
            <div>
              I accept the&nbsp;<Link href="/legal/terms"><a>Terms and Conditions</a></Link>,
              &nbsp;<Link href="/legal/privacy-policy"><a>Privacy Policy</a></Link>&nbsp;and
              &nbsp;<Link href="/legal/cookie-policy"><a>Cookie Policy</a></Link>
            </div>
          }/>
      </FormGroup>
    </FormControl>
  )
}
