import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../footer/Footer";
import Catalogue from "../catalogue/Catalogue";
import { makeStyles } from "@material-ui/core/styles";
import { Container, CssBaseline } from "@material-ui/core";
import Nav from "../nav/Nav";
import Slideshow from "../slideshow/Slideshow.jsx";
import { saveUser } from "../../redux/actions/users";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles((theme) => ({
  home: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

export default function Home() {
  const classes = useStyles();
  const userDB = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Cuando el usuario se loguea, se envía la información a DB
  useEffect(async () => {
    console.log('user', user)
    if (isAuthenticated && !userDB) {
      const token = await getAccessTokenSilently();

      let headers = {
        authorization: `Bearer ${token}`,
        email: user.email,
      };

      dispatch(saveUser(user, headers));
    }
  }, [isAuthenticated]);

  return (
    <div className={classes.home}>
      <Nav />
      <Slideshow />
      <Catalogue />
      <Footer />
    </div>
  );
}
