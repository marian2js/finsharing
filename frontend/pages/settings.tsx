import React, { FormEvent, useEffect, useState } from 'react'
import { withApollo } from '../src/apollo'
import Head from 'next/head'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core'
import { MessageSnackbar, MessageSnackbarType } from '../components/MessageSnackbar'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Error from 'next/error'
import { User } from '../src/types/User'
import theme from '../src/theme'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { ChangePasswordDialog } from '../components/users/ChangePasswordDialog'

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel (props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

function tabProps (index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  }
}

const useStyles = makeStyles(theme => ({
  submitButton: {
    float: 'right',
    margin: theme.spacing(3, 0),
  },
}))

const VIEWER_QUERY = gql`
  {
    viewer {
      username
      email
      website
      fullName
    }
  }
`

const UPDATE_PROFILE_MUTATION = gql`
  mutation ($username: String!, $fullName: String!, $email: String!, $website: String!) {
    updateUser (input: { username: $username, fullName: $fullName, email: $email, website: $website }) {
      user {
        username
        fullName
        email
        website
      }
    }
  }
`

const SettingsPage = () => {
  const classes = useStyles()
  const { loading, error, data } = useQuery(VIEWER_QUERY)
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION)
  const viewer: User = data?.viewer

  const [fullName, setFullName] = useState(viewer?.fullName || '')
  const [email, setEmail] = useState(viewer?.email || '')
  const [website, setWebsite] = useState(viewer?.website || '')
  const [tabIndex, setTabIndex] = useState(0)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [message, setMessage] = useState<MessageSnackbarType>()

  useEffect(() => {
    setFullName(data?.viewer?.fullName || '')
    setEmail(data?.viewer?.email || '')
  }, [data])

  if (error) {
    return <Error title={error.message} statusCode={404}/>
  }

  if (loading || !viewer) {
    return <CircularProgress/>
  }

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateProfile({
      variables: {
        username: viewer.username,
        fullName,
        email,
        website,
      }
    })
    setMessage({ text: 'Profile updated', severity: 'success' })
  }

  const handleTabChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    e.preventDefault()
    setTabIndex(newValue)
  }

  return (
    <>
      <Head>
        <title>User settings - FinSharing.com</title>
      </Head>

      <AppBar position="static" color="default">
        <Tabs value={tabIndex}
              onChange={handleTabChange}
              aria-label="setting tabs"
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth">
          <Tab label="Profile" {...tabProps(0)} />
          <Tab label="Security" {...tabProps(1)} />
        </Tabs>
      </AppBar>

      <Card>
        <CardContent>
          <TabPanel value={tabIndex} index={0} dir={theme.direction}>
            <form onSubmit={handleProfileSubmit}>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    onChange={e => setFullName(e.target.value)}
                    value={fullName}
                    name="fullName"
                    variant="outlined"
                    margin="normal"
                    fullWidth/>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth/>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Website"
                    onChange={e => setWebsite(e.target.value)}
                    value={website}
                    name="website"
                    variant="outlined"
                    margin="normal"
                    fullWidth/>
                </Grid>
              </Grid>

              <Grid item xs={12} className={classes.submitButton}>
                <Button type="submit" size="large" variant="contained" color="primary">
                  Update
                </Button>
              </Grid>
            </form>
          </TabPanel>
          <TabPanel value={tabIndex} index={1} dir={theme.direction}>
            <Button onClick={() => setChangePasswordDialogOpen(true)} startIcon={<VpnKeyIcon/>}>Change password</Button>
          </TabPanel>
        </CardContent>
      </Card>

      <MessageSnackbar message={message}/>

      <ChangePasswordDialog username={viewer.username}
                            open={changePasswordDialogOpen}
                            onClose={() => setChangePasswordDialogOpen(false)}/>
    </>
  )
}

export default withApollo(SettingsPage)
