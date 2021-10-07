import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { useContext, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Cancel } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import deleteOneItem from "../../redux/actions/deleteOneItem";
import { UserContext } from "./UserContext";
import React from "react";
import addToCart from "../../redux/actions/addToCart";
import { numberWithCommas } from "../../utils";
import { decrementQuantityCart } from "../../redux/actions/decrementQuantityCart";
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "8px",
    display: "flex",
    justifyContent: 'center',
  },
  card: {
    display: "flex",
    alignItems: "center",
    background: "#FAFAFA",
    width: '75vw',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  counterBox: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      marginTop: '10px'
    },
    display: "flex",
    alignItems: "center"
  },
  name:{
    width: "400px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",        
    [theme.breakpoints.down('md')]:{
      width: "300px"
    },
    [theme.breakpoints.down('sm')]:{
      width: "200px"
    }
  },
  units:{
    [theme.breakpoints.down('sm')]:{
      display: 'none'
    }
  },
  boxImg: {
    overflow: "hidden",
    width: "100px",
    height: "100px",
    textAlign: "center",
    overflow: "hidden",
    [theme.breakpoints.down('xs')]: {
      height: '200px',
      width: 'max-content'
    }
  },
  mediaimg: {
    maxWidth: "max-content",
    height: "100px",
    margin: "0 - 100%",
    objectFit: "contain",
    [theme.breakpoints.down('xs')]: {
      height: '100%'      
    }
  },
  counter: {
    [theme.breakpoints.down('sm')]: {
      marginRight: '0'
    },
    border: '2px solid #B7B9C0', 
    borderRadius:'20px', 
    color:'black', 
    width: 'max-content', 
    marginRight: '90px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap' 
  },
  description: {
    display: "flex",
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',    
    },
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'      
    }
  }
}));

const ShoppingCartItem = ({
  _id,
  name,
  description,
  price,
  stock,
  brand,
  image,
  categories,
  qualification,
  quantity,
}) => {
  const classes = useStyles();
  const [counter, setCounter] = useState(quantity > stock ? stock : quantity);
  const [totalValue, setTotalValue] = useState(price);
  const dispatch = useDispatch();
  const { shoppingCart, setShoppingCart } = useContext(UserContext);
  const { cartQuantity, totalPurchase } = shoppingCart;

  const increment = (e) => {
    setCounter(counter + 1);
    setShoppingCart((value) => ({
      ...value,
      cartQuantity: cartQuantity + 1,
    }));
    dispatch(addToCart(_id));
  };

  const decrement = (e) => {
    setCounter(counter - 1);
    dispatch(decrementQuantityCart(_id));
    if (cartQuantity > 0) {
      setShoppingCart((value) => ({
        ...value,
        cartQuantity: cartQuantity - 1,
      }));
    }
  };

  const handleDelete = (e) => {
    dispatch(deleteOneItem(_id));
    setShoppingCart((cant) => ({
      ...cant,
      cartQuantity: cartQuantity - quantity,
    }));
  };

  return (
    <Container className={classes.root}>
      <Grid>
        <Card className={classes.card}>
          <Box className={classes.boxImg} width="100px">
            <CardMedia
              className={classes.mediaimg}
              component="img"
              alt="img"
              image={`${REACT_APP_SERVER}/products/images/${image}`}
            />
          </Box>
          <Container>
            <Box className={classes.description}>
              <Typography className={classes.name} variant="h6">
                {name}
              </Typography>
              <Box className={classes.counterBox}>
                <Box className={classes.counter}>
                  <IconButton
                    aria-label="remove"
                    onClick={decrement}
                    disabled={counter === 1 || counter === 0}
                  >
                    <RemoveIcon />
                  </IconButton>
                  {counter}
                  <IconButton
                    aria-label="add"
                    onClick={increment}
                    disabled={counter === stock}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="subtitle2" align="center" className={classes.units}>
                    {stock} unidades
                  </Typography>
                </Box>
                <Box marginRight={7} ml={7} style={{ width: "max-content" }}>
                  <Typography variant="body1" style={{fontWeight: 'bold'}}>
                    $ {numberWithCommas(totalValue * counter)}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={handleDelete}>
                    <Cancel />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Container>
        </Card>
      </Grid>
    </Container>
  );
};

export default ShoppingCartItem;
