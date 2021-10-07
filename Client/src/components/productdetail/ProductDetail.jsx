import React, { useContext, useEffect, useState } from "react";
import { Typography, Divider, CircularProgress } from "@material-ui/core";
import { CardMedia, Box, Grid, Button, Container } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { makeStyles } from "@material-ui/styles";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Nav from "../nav/Nav";
import { numberWithCommas } from "../../utils";
import { UserContext } from "../shoppingcart/UserContext";
import { useDispatch, useSelector } from "react-redux";
import addToCart from "../../redux/actions/addToCart";
import getDetails from "../../redux/actions/getDetails";
import Review from "../review/Review";
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  media: {
    width: "100%",
    paddingTop: "70%", // 16:9
    marginTop: "5vh",
    backgroundSize: "contain",
    "&:hover": {
      backgroundSize: "larger",
    },
  },
  container: {
    width: "80vh",
    margin: "5vh",
  },
  price: {
    width: "80vh",
    margin: "5vh",
  },
  mp: {
    maxWidth: "8vh",
    marginRight: "5vh",
    marginLeft: "5vh",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    width: "20vh",
    height: "7vh",
    fontSize: "2vh",
    marginRight: "4vh",
    marginLeft: "4vh",
  },
  disp: {
    color: theme.palette.primary.dark,
  },
}));

export default function ProductDetail() {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data, success, loading } = useSelector(({ app }) => app.detail);
  const shoppingCartProducts = useSelector((state) => state.cart.cart);
  const { shoppingCart, setShoppingCart } = useContext(UserContext);
  const { cartQuantity } = shoppingCart;

  const handleAdd = (e) => {
    setShoppingCart((value) => ({
      ...value,
      cartQuantity: cartQuantity + 1,
    }));
    dispatch(addToCart(id));
    // window.localStorage.setItem('cartItems', JSON.stringify(shoppingCartProducts) )
  };

  console.log("detalle", data);

  useEffect(() => {
    dispatch(getDetails(id));
  }, [dispatch, id]);

  return (
    <div>
      {loading && (
        <div className="loading">
          <CircularProgress />
        </div>
      )}
      {!loading && success && (
        <Grid container style={{ marginTop: "-3vh" }}>
          <Grid item xs={6}>
            <CardMedia
              className={classes.media}
              image={`${REACT_APP_SERVER}/products/images/${data.image}`}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              component="h1"
              variant="h4"
              className={classes.container}
            >
              {data.name}
              <Divider variant="middle" light />
            </Typography>
            <Typography variant="h3" component="h2" className={classes.price}>
              ${numberWithCommas(data.price)}
              <Divider variant="fullwidth" />
            </Typography>
            <Typography
              component="p"
              variant="body2"
              className={classes.container}
            >
              {data.description}
            </Typography>
            <Grid
              style={{
                width: "600px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box>
                {" "}
                <img
                  src={"https://img.icons8.com/color/480/mercado-pago.png"}
                  className={classes.mp}
                />
              </Box>

              <Button
                variant="contained"
                className={classes.button}
                onClick={handleAdd}
                endIcon={<ShoppingCartIcon />}
              >
                Agregar
              </Button>
              {data.stock >= 1 && (
                <Link to={`/order/${id}`} style={{ textDecoration: "none" }}>
                  <Button variant="contained" className={classes.button}>
                    Comprar
                  </Button>
                </Link>
              )}
            </Grid>
            <Box className={classes.box}>
              {data.stock === 0 ? (
                <Typography
                  variant="body2"
                  color="error"
                  component="h3"
                  className={classes.container}
                >
                  Sin stock
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  component="h2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "green",
                  }}
                >
                  Hay unidades disponibles!
                </Typography>
              )}
            </Box>
            {/* <Typography
                variant="body2"
                component="h3"
                className={classes.container}
              >
                {data.brand}
              </Typography> */}
          </Grid>
          <Review product={data} />
        </Grid>
      )}
    </div>
  );
}
