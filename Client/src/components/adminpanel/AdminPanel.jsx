import React from "react";
import {
  Grid,
  Card,
  CardActions,
  Box,
  Typography,
  Button,
  Container,
  Paper
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useRouteMatch } from "react-router-dom";
import NavSecondary from "../navsecondary/NavSecondary";

// idea: cards de cada funcionalidad
//-stock. edicion de lo que ya esta subido
//-cargar producto, categorias
//-historial de ventas
//-administrar usuarios
//-secciones (ofertas-novedades)
const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexDirection: "column", 
    alignContent: "center",
    padding: "5%",
  },
  gridItem: {
    padding: '1%', 
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.dark,
  },
  text: {
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    "&:hover": {
      background: "linear-gradient(to left, #16222a, #3a6073)",
      cursor: "pointer",
    },
  },
}));

export default function AdminPanel() {
  const classes = useStyles();
  let { path, url } = useRouteMatch();

  const arrayItems = [
    { "name": "Stock", "route": "/addcategory" },
    { "name": "Crear Nueva Categoría", "route": "/stock" },
    { "name": "Cargar Producto", "route": "/addcategory" },
    { "name": "Administrar Usuarios", "route": "/usermanagement" },
    { "name": "Historial de Ventas", "route": "/sales" }
  ]

  return (
    <Box>
      <NavSecondary />
      <Grid
        container
        className={classes.gridContainer}
      >
        {
          arrayItems.map(e => (
            <Grid align="center" className={classes.gridItem} >
              <Link to={e.route} className={classes.link}>
                <Typography variant="h6" align="center" className={classes.text} >
                  {e.name}
                </Typography>
              </Link>
            </Grid>
          ))
        }
      </Grid>
    </Box >
  )
}
