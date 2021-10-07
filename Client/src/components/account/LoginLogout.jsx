import { useAuth0 } from "@auth0/auth0-react";
import { MenuItem } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import cleanCart from "../../redux/actions/cleanCart";
import { linkUserCart } from "../../redux/actions/linkUserCart";
import { cleanUser } from "../../redux/actions/users";
import { clearApp } from "../../redux/actions/clearApp";


export default function LoginLogout() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const userDB = useSelector((state) => state.app.user);
  const shoppingCartin = useSelector(state => state.cart.cart)
  const dispatch = useDispatch();

  const handleChangeLogout = () => {
    logout();
    const userCartToDb = {
      user: userDB,
      cart: shoppingCartin
    }
    dispatch( linkUserCart( userCartToDb ))
    dispatch(cleanUser());
    dispatch( cleanCart() )
    dispatch(clearApp());
  };

  return (
    <div>
      {isAuthenticated  && userDB  ? (
        <MenuItem onClick={handleChangeLogout}>Salir</MenuItem>
      ) : (
        <MenuItem onClick={loginWithRedirect}>Ingresá</MenuItem>
      )}
    </div>
  );
}
