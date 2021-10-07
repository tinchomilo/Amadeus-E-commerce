// src/auth/auth0-provider-with-history.js
import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
const { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID, REACT_APP_AUTH0_AUDIENCE } = process.env;

export default function Auth0ProviderWithHistory({ children }){
    const history = useHistory();

    const onRedirectCallback = (appState) => {
        history.push(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={REACT_APP_AUTH0_DOMAIN}
            clientId={REACT_APP_AUTH0_CLIENT_ID}
            redirectUri={window.location.origin}
            audience={REACT_APP_AUTH0_AUDIENCE}
            // scope="read:current_user update:current_user_metadata"
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

