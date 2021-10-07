import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { saveUser } from "../redux/actions/users";
import { useDispatch, useSelector } from "react-redux";

export let headers;

function GetHeaders() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const userDB = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

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

  if (user) {
    const setHeaders = async () => {
      const token = isAuthenticated && (await getAccessTokenSilently());
      return (headers = {
        authorization: `Bearer ${token}`,
        email: user?.email,
      });
    };

    setHeaders();
  }

  return <></>
}

export default GetHeaders;
