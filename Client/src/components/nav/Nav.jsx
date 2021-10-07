import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { alpha, makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Badge,
  MenuItem,
  Menu,
  Box,
  Container,
  CssBaseline,
} from "@material-ui/core";
import { LocationOn, ShoppingCart, AccountCircle, Favorite, Mail } from "@material-ui/icons";
import SearchBar from "../searchbar/SearchBar";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../shoppingcart/UserContext";
import LoginLogout from "../account/LoginLogout";
import OnlyLogin from "../account/OnlyLogin";
import logo from '../../img/logo_ecommerce.jpg';
import axios from 'axios';
import { headers } from "../../utils/GetHeaders"
import { getUserById, saveUser } from "../../redux/actions/users";

const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  grow: {
    // flexGrow: 1,
  },
  // menuButton: {
  //   marginRight: theme.spacing(2),
  // },
  // title: {
  //   display: "none",
  //   [theme.breakpoints.up("sm")]: {
  //     display: "block",
  //   },
  // },
  // search: {
  //   position: "relative",
  //   borderRadius: theme.shape.borderRadius,
  //   backgroundColor: alpha(theme.palette.common.white, 0.15),
  //   "&:hover": {
  //     backgroundColor: alpha(theme.palette.common.white, 0.25),
  //   },
  //   marginRight: theme.spacing(2),
  //   marginLeft: theme.spacing(7),
  //   width: "40%",
  // },
  // searchIcon: {
  //   padding: theme.spacing(0, 2),
  //   height: "100%",
  //   position: "absolute",
  //   pointerEvents: "none",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // inputRoot: {
  //   color: "inherit",
  // },
  // inputInput: {
  //   padding: theme.spacing(1, 1, 1, 0),
  //   // vertical padding + font size from searchIcon
  //   paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
  //   transition: theme.transitions.create("width"),
  //   width: "100%",
  //   [theme.breakpoints.up("md")]: {
  //     width: "20ch",
  //   },
  // },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  // sectionMobile: {
  //   display: "flex",
  //   [theme.breakpoints.up("md")]: {
  //     display: "none",
  //   },
  // },
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
    fontFamily: "Abadi MT Condensed Light",
    fontSize: "40px",
    color: "white",
    // textDecoration: "underline white"
    textDecoration: "none"

  },
  avatar: {
    width: "2vw",
    borderRadius: "15px",
    backgroundSize: "contain",
  },
  // color: theme.palette.primary.light,
  // fontSize: "70%",
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
  }

}));

export default function Nav() {
  const classes = useStyles();
  const userRedux = useSelector(({ app }) => app.user);
  const shoppingCartProducts = useSelector((state) => state.cart.cart);

  const [userDb, setUserDb] = useState();
  console.log(userDb);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const favorites = useSelector(({ app }) => app.favorites);

  const users = useSelector(({ app }) => app.usersLoaded);
  const { isAuthenticated, user, isLoading } = useAuth0();

  const dispatch = useDispatch();

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

      {userDb && (
        <Link to="/userprofile" className={classes.link}>
          <MenuItem>Perfil</MenuItem>
        </Link>
      )}

      {userDb && userDb.isAdmin && (
        <Link to="/adminpanel" className={classes.link}>
          <MenuItem>Administrar</MenuItem>
        </Link>
      )}
      <LoginLogout />
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Grid>
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
    </Grid>
  );

  return (
    <div>
      <AppBar
        style={{
          position: "relative",
          backgroundColor: "rgb(0, 23, 20)",
          width: "100%",
        }}
      >
        <Toolbar className={classes.navDisplay}>
          <Link to="/" style={{ margin: '1vh', textDecoration: "none" }}>
            {<Typography className={classes.logo}>AmadeuS </Typography>}
          </Link>

          <SearchBar />

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
                onClick={userDb && handleProfileMenuOpen}
                color="inherit"
              >
                {userDb ? (
                  <img src={userDb.picture} className={classes.avatar} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>

            </Container>

            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              component={Link}
              to="/cart"
            >
              <Badge badgeContent={shoppingCartProducts?.reduce((acc, item) => (acc + item.quantity), 0)} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              component={Link}
              to="/favorites"
            >
              <Badge
                badgeContent={
                  user ? (favorites?.length > 0 ? favorites.length : null) : null
                }
                color="secondary"
              >
                <Favorite />
              </Badge>
            </IconButton>

          </div>
        </Toolbar>
        {/* <div style={{display:'flex', justifyContent:'flex-end', marginRight:'2vw'}}>
          <Link to='/adduser' style={{ textDecoration: "none", color:"#ffffff" }}>
          <Typography variant="p" noWrap>
          Registrate
          </Typography>
          </Link>
        </div> */}
        {/* Sin esto el nav tapa los ordenamientos y filtrado y no se ven */}
        {/* <div className={classes.offset}></div> NO BORRAR */}
        {/* <div className={classes.offset}></div> NO BORRAR */}
        {renderMobileMenu}
        {renderMenu}
      </AppBar>
      <div classname={classes.offset} />
    </div>
  );
}
