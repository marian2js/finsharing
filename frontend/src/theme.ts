import { createMuiTheme } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[300],
    },
    secondary: {
      main: pink[200],
    },
    background: {
      default: '#202020',
      paper: '#222527',
    },
  }
})

export default theme
