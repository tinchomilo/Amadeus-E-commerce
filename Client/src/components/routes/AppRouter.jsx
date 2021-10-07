import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../home/Home";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../theme";
import { AddCategory } from "../addcategory/AddCategory";
import AddProduct from "../addproduct/AddProduct";
import AdminPanel from "../adminpanel/AdminPanel";
import Order from "../order/Order";
import OrderDetail from "../orderdetail/OrderDetail";
import "../../App.css";
import Stock from "../stock/Stock";
import EditUserInfo from "../edituserinfo/EditUserInfo";
import UserManagement from "../usermanagement/UserManagement";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import OrderCart from "../ordercart/OrderCart";
import Sales from "../sales/Sales";
import "../../App.css";
import ShoppingCart from "../shoppingcart/ShoppingCart";
import { UserContext } from "../shoppingcart/UserContext";
import "../../App.css";
import Detail from "../detail/Detail";
import { useDispatch, useSelector } from "react-redux";
import GetHeaders from "../../utils/GetHeaders"
import LandingPage from '../landing/Landing';

// import Account from "../account/Account";
// import Profile from "../account/Profile";
import { useHistory } from "react-router";
import UserProfile from "../userprofile/UserProfile";
import ShoppingHistory from "../shoppinghistory/ShoppingHistory";
import Favorites from "../favorites/Favorites";

const AppRouter = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const history = useHistory();
  const userDB = useSelector(({ app }) => app.user);

  console.log("admin", userDB);

  const adminAuth = function (component) {
    if (user) {
      return (user.email && user.email === "crismaxbar@gmail.com") ||
        user.email === "heisjuanpablo@gmail.com" ||
        user.email === "leandrobuzeta@gmail.com" ||
        user.email === "juanmhdz99@gmail.com" ||
        user.email === "martinmilone2011@gmail.com"
        ? component
        : Home;
    } else if (isAuthenticated === false) {
      return Home;
    }
  };

  const initialState = {
    cartQuantity: JSON.parse(window.localStorage.getItem("cant")),
    cartItems: [],
    userItems: 0,
    cantItemsDbToCart: 0,
  };

  const [shoppingCart, setShoppingCart] = useState(initialState);

  return (
    <>
      <div className="app">
        <ThemeProvider theme={theme}>
        <Route path="/" component={GetHeaders} />
          <Switch>
            {/* <UserContext.Provider value={{quantityCart, setQuantityCart}}> */}
            <UserContext.Provider value={{ shoppingCart, setShoppingCart }}>
              {/* El catalogo se tiene que visualizar en la ruta /products
            Hay que poner otro home de inicio que no sea el catalogo */}

              <Route exact path='/landing' component={LandingPage} />
              <Route exact path="/" component={Home} />
              <Route path="/detail/:id" component={Detail} />
              {userDB && userDB.isAdmin && (
                <Route path="/stock" component={Stock} />
              )}
              {userDB && userDB.isAdmin && (
                <Route path="/adminpanel" component={AdminPanel} />
              )}
              {userDB && userDB.isAdmin && (
                <Route path="/addcategory" component={AddCategory} />
              )}
              {userDB && userDB && userDB.isAdmin && (
                <Route path="/addproduct" component={AddProduct} />
              )}
              {userDB && userDB.isAdmin && (
                <Route path="/editproduct/:id" component={AddProduct} />
              )}
              <Route path="/cart" component={ShoppingCart} />
              <Route
                path="/order/:id"
                component={withAuthenticationRequired(Order)}
              />
              <Route
                path="/ordercart"
                component={withAuthenticationRequired(OrderCart)}
              />
              <Route path="/orderdetail" component={OrderDetail} />
              {userDB && userDB.isAdmin && (
                <Route
                  path="/usermanagement"
                  component={UserManagement}
                />
              )}
              <Route path="/edituserinfo" component={EditUserInfo} />
              {userDB && userDB.isAdmin && (
                <Route path="/sales" component={Sales} />
              )}
              
              <Route path="/shoppinghistory" component={ShoppingHistory} />
              {/* <Route path ="/account" component={Account} />
            <Route path ="/profile" component={Profile} /> */}
              <Route
                path="/userprofile"
                component={withAuthenticationRequired(UserProfile)}
              />
              <Route path="/favorites" component={Favorites} />
            </UserContext.Provider>
            <Redirect to="/" />
          </Switch>
        </ThemeProvider>
      </div>
    </>
  );
};
export default AppRouter;
