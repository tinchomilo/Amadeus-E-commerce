import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, AppBar, Toolbar, Typography, Box, Container, InputLabel, Button, IconButton, Grid, MenuItem, Badge, Menu } from '@material-ui/core';
import { LocationOn, ShoppingCart, AccountCircle, Favorite, Mail, HomeRounded } from "@material-ui/icons";
import logo from '../../img/logo_ecommerce.jpg';
import { Link } from 'react-router-dom';
import LoginLogout from "../account/LoginLogout";
import OnlyLogin from "../account/OnlyLogin";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../shoppingcart/UserContext";
const { REACT_APP_SERVER } = process.env;

// const useStyles = makeStyles((theme) => ({
//   nav: {
//     backgroundColor: 'rgb(0, 23, 20)',
//     height: '10%',
//     marginBottom: '7vh',
//     position: 'absolute'

//   },
//   icon: {
//     width: "7vh",
//     backgroundSize: "contain",
//     margin: "auto",
//   },
//   text: {
//     color: theme.palette.primary.light
//   }
// }));

const useStyles = makeStyles((theme) => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  offset: theme.mixins.toolbar,
  link: {
    textDecoration: "none",
    color: theme.palette.primary.dark,
  },
  navDisplay: {
    display: "flex",
    justifyContent: "space-between",
  },
  logo: {
    // // marginTop: "2vh",
    // height: "95%",
    // width: "25vh",
    // backgroundSize: "contain",
    // // margin: "auto",
    // // borderRadius: "6px",
    fontFamily: "Abadi MT Condensed Light",/*  "Garamond",  */
    fontSize: "40px",
    color: "white",
    // textDecoration: "underline white"
  },
  avatar: {
    width: "2vw",
    borderRadius: "15px",
    backgroundSize: "contain",
  },
  welcome: {
    // marginTop: "2vh",
    color: theme.palette.primary.light
  },
  text: {
    color: theme.palette.primary.light,
    fontSize: "80%",
    marginTop: "2vh",
    marginLeft: "-5vh",
  },
  user: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));


export default function NavSecondary({ shipping, success }) {
  const classes = useStyles();
  const userRedux = useSelector(({ app }) => app.user);
  const shoppingCartProducts = useSelector((state) => state.cart.cart);

  const [userDb, setUserDb] = useState();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const favorites = useSelector(({ app }) => app.favorites);
  // const currentUser = useSelector(({app}) => app.user);
  const users = useSelector(({ app }) => app.usersLoaded);
  const { isAuthenticated, user, isLoading } = useAuth0();
  // const userDB = useSelector((state) => state.app.user);
  // console.log("usuario DB", userDb);
  const dispatch = useDispatch();
  // console.log("nav", isAuthenticated);
  // console.log("auth0 user", user);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const { shoppingCart } = useContext(UserContext);
  const { cartQuantity } = shoppingCart;
  const menuId = "primary-search-account-menu";

  const adminAuth = function () {
    let usersAdmin = [];
    if (!isLoading) {
      if (user) {
        users.forEach((u) => {
          u.isAdmin === true && usersAdmin.push(u.email);
        });
        // return user.email && usersAdmin.includes(user.email) ? true : false;
        return (user.email && user.email === "crismaxbar@gmail.com") ||
          user.email === "heisjuanpablo@gmail.com" ||
          user.email === "leandrobuzeta@gmail.com" ||
          user.email === "juanmhdz99@gmail.com"
          ? true
          : false;
      }
    }
  };

  const getUserById = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER}/users/${userRedux._id}`
      );
      setUserDb(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserById(userRedux?._id);
  }, [userRedux]);


  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >

      {userDb && userDb.isAdmin && (
        <Link to="/adminpanel" className={classes.link}>
          <MenuItem>Administrar</MenuItem>
        </Link>
      )
      }

      {
        userDb && (
          <Link to="/userprofile" className={classes.link}>
            <MenuItem>Perfil</MenuItem>
          </Link>
        )
      }

      <LoginLogout />
    </Menu >
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <Mail />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <Favorite />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar style={{
      position: "relative",
      backgroundColor: "rgb(0, 23, 20)",
      width: "100%",
    }}>
      <Toolbar className={classes.navDisplay}>
        {/* Propuesta de logo 1 */}
        {/* <Link to="/" style={{ margin: '1vh' }}>
          <img src={logo} className={classes.logo} />
        </Link> */}
        {/* Propuesta de logo 2 */}
        <Link to="/" style={{ margin: '1vh', textDecoration: "none" }}>
          {<Typography className={classes.logo}>AmadeuS </Typography>}
        </Link>
        {/* {
          success === "approved" &&
          <Box style={{ marginLeft: '30%', width: '90%' }}>
            <Typography style={{ fontSize: '1.1em' }} className={classes.text}>
              Gracias por tu compra!
            </Typography>
          </Box>
        } */}

        {/* <Button
          component={Link} to='/'
          variant='contained'
          color='primary'
          endIcon={<HomeRounded color="black" />}
        >
          Home
        </Button> */}
        <Link to="/" style={{ margin: '1vh', textDecoration: "none" }}>
          <Button
            component={Link} to='/'
            endIcon={<HomeRounded />}
            variant="text"
            style={{color: "white", fontSize: "vh"}}
            size="large"
          >
            HOME
          </Button>
        </Link>
        {/* 
        {
          shipping &&
          <Container style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LocationOnIcon className={classes.text} />
            <Typography style={{ fontSize: '0.95em', marginTop: '1vh' }} className={classes.text}>
              {shipping[0]?.street && `${shipping[0]?.street} ${shipping[0]?.number}, ${shipping[0]?.state}`}
            </Typography>
          </Container>
        } */}

        {/* <Box className={classes.sectionDesktop}>
          <LoginLogout />
          {userDb && (
            <Typography
              component="p"
              variant="body2"
              className={classes.welcome}
            >
              {userDb.nickname}
            </Typography>
          )}
        </Box>
        <div className={classes.sectionDesktop}> */}

        <div className={classes.sectionDesktop}>
          <Container className={classes.user}>


            <OnlyLogin />

            {userDb && (
              <Typography
                component="p"
                variant="body2"
                className={classes.welcome}
              >
                {userDb.nickname}
              </Typography>
            )}

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {userDb ? (
                <img src={userDb.picture} className={classes.avatar} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>

          </Container>
        </div>

        {renderMobileMenu}
        {renderMenu}
      </Toolbar>
    </AppBar>
  )
}

