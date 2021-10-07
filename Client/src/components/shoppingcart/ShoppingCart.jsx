import React, { useContext, useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import ShoppingCartItem from "./ShoppingCartItem";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Box, Button, Divider, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import cleanCart from "../../redux/actions/cleanCart";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { numberWithCommas } from "../../utils";
import axios from "axios";
import addOrder from "./../../redux/actions/addOrder";
import logo from "./logo.jpg";
import { linkUserCart } from "../../redux/actions/linkUserCart";
import NavSecondary from "../navsecondary/NavSecondary";

const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-evenly'
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      alignItems: "center",
      margin: theme.spacing(2)
    },
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
    containerItems: {
    width: '100%',
    backgroundColor: "#FAFAFA",
    height: "100%",
    border: "1px solid #E7E4E4",
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('lg')]: {
      height: '100%'
    }
  },
  icon: {
    width: "8vh",
    backgroundSize: "contain",
    margin: "auto",
    offset: theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: "rgb(0, 23, 20)",
    height: "10%",
    position: "sticky",
  },
  btnComprar: {
    marginTop: "2vh",
    width: '10vw',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  btnVaciar: {
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    }
  }
}));

const ShoppingCart = () => {
  const classes = useStyles();
  const shoppingCartProducts = useSelector((state) => state.cart.cart);
  const { shoppingCart, setShoppingCart } = useContext(UserContext);

  const user = useSelector((state) => state.app.user);
  const { cartQuantity, cartItems, userItems, cantItemsDbToCart } =
    shoppingCart;
  const dispatch = useDispatch();
  const [idOrder, setIdOrder] = useState();

  const handleDeleteAll = () => {
    dispatch(cleanCart());
    setShoppingCart((value) => ({
      ...value,
      cartQuantity: 0,
      cantItemsDbToCart: 0,
    }));
    window.localStorage.setItem(
      "cartItems",
      JSON.stringify(shoppingCartProducts)
    );
    if (user) {
      console.log("existe");
      let obj = {
        user,
        cart: [],
      };
      user.cart = [];
      dispatch(linkUserCart(obj));
    }
  };
  useEffect(() => {
    if (user) {
      console.log("existe");
      let obj = {
        user,
        cart: shoppingCartProducts,
      };
      dispatch(linkUserCart(obj));
      user.cart = shoppingCart;
    }
  }, [shoppingCart]);

  useEffect(() => {
    window.localStorage.setItem("cant", JSON.stringify(cartQuantity));
    window.localStorage.setItem(
      "cartItems",
      JSON.stringify(shoppingCartProducts)
    );
    return () => {
      window.localStorage.setItem("cant", JSON.stringify(cartQuantity));
      window.localStorage.setItem(
        "cartItems",
        JSON.stringify(shoppingCartProducts)
      );
    };
  }, [cartQuantity]);

  return (
    <div className={classes.princ}>
      <CssBaseline />
      <NavSecondary />
      <Container className={classes.containerItems}>
        <div className={classes.root}>

          <Box marginLeft={5} className={classes.title}>
            <Typography variant="h2">Carrito</Typography>
          </Box>

          <Box className={classes.btnVaciar} style={{ marginRight: 80 }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<DeleteForeverRoundedIcon />}
              onClick={handleDeleteAll}
            >
              Vaciar Carrito
            </Button>
          </Box>

        </div>
        
        {shoppingCartProducts?.map((elem) => (
          <ShoppingCartItem key={elem._id} {...elem} />
        ))}

        <Divider />
        <Box style={{ marginTop: "9px", marginBottom: "9px" }}>
          <Typography variant="h4">
            Total de la compra: $
            {shoppingCartProducts.reduce((acc, item) => {
              return (acc += item.price * item.quantity);
            }, 0)}
          </Typography>
        </Box>

        <Divider style={{ marginBottom: "9px" }} />

        <Button
          className={classes.btnComprar}
          variant="contained"
          color="primary"
          disabled={shoppingCartProducts.length === 0}
          component={Link}
          to={`/ordercart`}
        >
          Comprar
        </Button>

      </Container>
    </div>
  );
};

export default ShoppingCart;
