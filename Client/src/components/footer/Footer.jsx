import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {BottomNavigation, BottomNavigationAction, CssBaseline, Typography, Container, Grid, Box, Link} from '@material-ui/core';
import logo from '../nav/logo.jpg';

const useStyles = makeStyles( (theme) => ({
    footer:{
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-around',
        color: theme.palette.primary.contrastText,
        backgroundColor: 'rgb(0, 23, 20)'

    }
}))

export default function Footer(){
    const classes = useStyles()
    return (
      
    <footer style={{width:'100%'}}>
      <Box
      className={classes.footer}
      px={{ xs: 3, sm: 10}}
      py={{xs: 5, sm:10}}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>Acerca de</Box>
              <Box>
                <Link href="/" color="inherit">
                  ¿Cómo llego?
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Métodos de pago
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Métodos de envío
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Cambios y devoluciones
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Sobre nosotros
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Ayuda
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>Contacto</Box>
              <Box>
                <Link href="/" color="inherit">
                  WhatsApp
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Email
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Dirección
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>Redes Sociales</Box>
              <Box>
                <Link href="/" color="inherit">
                  Facebook
                </Link>
              </Box>
              <Box>
                <Link href="/" color="inherit">
                  Instagram
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Box textAlign="center" pt={{xs: 5, sm: 10}} pb={{xs: 5, sm:0}}>
          <Typography style={{fontFamily: "Abadi MT Condensed Light"}}>AmadeuS &reg; {new Date().getFullYear()}</Typography>
          </Box>
        </Container>
      </Box>
    </footer>
    )
}
