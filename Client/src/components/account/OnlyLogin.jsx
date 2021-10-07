import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  welcome: {
    // marginTop: "2vh",
    color: theme.palette.primary.light
  },
}));

export default function OnlyLogin() {
  const classes = useStyles();
  const { isAuthenticated, loginWithRedirect, loginWithPopup } = useAuth0();
  const userDB = useSelector((state) => state.app.user);

  return (
    <div>
      {
      !isAuthenticated  && !userDB  && 
      <MenuItem className={classes.welcome} onClick={loginWithPopup}>Ingresá</MenuItem>
      }
    </div>
  );
}
