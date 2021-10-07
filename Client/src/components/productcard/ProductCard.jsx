import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Divider,
  Modal,
  Container,
  Backdrop,
  Box,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import { Link } from "react-router-dom";
import { numberWithCommas } from "../../utils";
import addToCart from "../../redux/actions/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { UserContext } from "../shoppingcart/UserContext";
import {
  getAllFavorites,
  addFavorite,
  deleteFavorite,
  removeAllFavorites,
} from "../../redux/actions/favorites";
import { useAuth0 } from "@auth0/auth0-react";
const REACT_APP_SERVER = process.env;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '67vh',
    width: '40vh', // Para que las cards tengan el mismo ancho sin importar el tamaño de la imagen
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",

    "&:hover": {
      boxShadow: "0 10px 40px 0px rgba(0,117,49,0.3)",
    },
    // marginRight: "2vh",
    // marginBottom:"2vh"
    margin: "2vh",
    [theme.breakpoints.down('sm')]: {
      width: '50vh',
      height: '75vh'
    },
  
  },
  media: {
    width: "100%",
    paddingTop: "95%", // 16:9
    margin: "0vh",
    backgroundSize: "contain",
  },

  price: {
    color: theme.palette.primary.dark,
    fontSize: "24px",
  },
  icon: {
    color: "grey",
    "&:hover": {
      color: theme.palette.primary.light,
    },
    "&:focus": {
      color: theme.palette.primary.light,
    },
  },
  iconFavorite: {
    color: theme.palette.primary.light,
    "&:hover": {
      color: "grey",
    },
    "&:focus": {
      color: "grey",
    },
  },
  text: {
    textDecoration: "none",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    width: "16vh",
    fontSize: "1.8vh",
  },
  link: {
    color: theme.palette.primary.dark,
    textDecoration: "none",
    "&:focus": {
      color: theme.palette.primary.light,
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    height: "20vh",
    width: "60vh",
  },
  shareIcon: {
    width: "4vh",
    height: "4vh",
    
  },
}));

export default function ProductCard(product) {
  const { id, name, price, image, stock } = product;
  //recibe de Products las props
  const cartState = useSelector(state => state.cart.cart);

  const classes = useStyles();
  const { shoppingCart, setShoppingCart } = useContext(UserContext);
  const { cartQuantity, cartItems } = shoppingCart;
  const [shareOpen, setShareOpen] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector(({ app }) => app.favorites);
  const currentUser = useSelector(({ app }) => app.user);

  const { user } = useAuth0();

  let flag = false;

  const agregar = (e) => {
    setShoppingCart((value) => ({
      ...value,
      cartQuantity: cartQuantity + 1,
    }));
    dispatch(addToCart(id));
  };

  const alStorage = JSON.stringify(cartState);

  useEffect(() => {
    window.localStorage.setItem("cant", JSON.stringify(cartQuantity));
    return () => {
      window.localStorage.setItem("cant", JSON.stringify(cartQuantity));
    };
  }, [cartQuantity]);

  function favoritesButton() {
    if (currentUser?.email) {
      dispatch(getAllFavorites(currentUser?._id));
      let post = true;
      favorites?.forEach((favorite) => {
        if (favorite._id === id) {
          if (favorites.length === 1) {
            dispatch(deleteFavorite(currentUser?._id, id));
            dispatch(removeAllFavorites());
          } else {
            dispatch(deleteFavorite(currentUser?._id, id));
            dispatch(getAllFavorites(currentUser?._id));
          }
          post = false;
        }
      });
      if (post) {
        dispatch(addFavorite(currentUser?._id, id));
        dispatch(getAllFavorites(currentUser?._id));
      }
    }
    dispatch(getAllFavorites(currentUser?._id));
  }

  const handleShare = () => {
    setShareOpen(!shareOpen);
  };
  const handleClose = () => setShareOpen(false);

  return (
    <Card className={classes.root}>
      <Link to={`/detail/${id}`} className={classes.link}>
        <CardMedia className={classes.media} image={image} />
        <CardContent>
          <Typography component="h1" className={classes.price}>
            $ {numberWithCommas(price)}
          </Typography>
          <Typography variant="body2" component="h3">
            {name.substring(0, 25) + "..."}
          </Typography>
          {stock <= 0 ? (
            <Typography variant="body2" color="error" component="p">
              Sin stock
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary" component="p">
              Entrega en 24hs
            </Typography>
          )}
        </CardContent>

        <Divider variant="middle" light />
      </Link>
      {shareOpen && (
        <Box
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "15vh",
            marginTop: "-4.5vh",
            marginLeft: "25vh",
          }}
        >
          <EmailShareButton
            url={`https://musical-e-commerce.vercel.app//detail/${id}`}
            text="Mira este hermoso instrumento!"
          >
            <EmailIcon className={classes.shareIcon} round={true} />
          </EmailShareButton>

          <FacebookShareButton
            url={`https://musical-e-commerce.vercel.app//detail/${id}`}
            quote="Mira este hermoso instrumento!"
            hashtag="[instrument]"
          >
            <FacebookIcon className={classes.shareIcon} round={true} />
          </FacebookShareButton>
          <WhatsappShareButton
            url={`https://musical-e-commerce.vercel.app//detail/${id}`}
            text="Mira este hermoso instrumento!"
          >
            <WhatsappIcon className={classes.shareIcon} round={true} />
          </WhatsappShareButton>
        </Box>
      )}
      <CardActions style={{ display: "flex", justifyContent: "space-between" }}>
        {favorites?.forEach((favorite) => {
          if (favorite._id === id) flag = true;
        })}
        <IconButton aria-label="add to favorites" onClick={favoritesButton}>
          <FavoriteIcon
            className={
              user ? (flag ? classes.iconFavorite : classes.icon) : classes.icon
            }
          />
        </IconButton>
        <IconButton aria-label="share" onClick={handleShare}>
          <ShareIcon className={classes.icon} />
        </IconButton>

        <Button
          variant="contained"
          className={classes.button}
          disabled={stock <= 0 || cartState?.find( e => e._id===id)?.quantity===stock}
          onClick={agregar}
          endIcon={<ShoppingCartIcon />}
        >
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
}
