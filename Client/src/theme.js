import { createTheme } from '@material-ui/core/styles';
import { green, grey } from '@material-ui/core/colors';


const theme = createTheme({
    palette: {
        primary: {
            light: green['A700'],
            main: green[900] ,
            dark: grey[900],
            contrastText: grey[50]
        },
        secondary: {
            main: green['A700']
        }
    },
    transitions: {
        easing: {
            // This is the most common easing curve.
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            // Objects enter the screen at full velocity from off-screen and
            // slowly decelerate to a resting point.
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            // Objects leave the screen at full velocity. They do not decelerate when off-screen.
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            // The sharp curve is used by objects that may return to the screen at any time.
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
          },
    }
}

)

export default theme;