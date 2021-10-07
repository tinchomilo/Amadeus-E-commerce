import axios from "axios";
import { LINK_USER_CART, USER_ERRORS } from ".";
import { headers } from "../../utils/GetHeaders"

const { REACT_APP_SERVER } = process.env;

export const linkUserCart = ( obj ) => {
    return async( dispatch ) => {
        try {
            await axios.post(`${REACT_APP_SERVER}/users/cart`, obj, {headers})
            return dispatch({
                type: LINK_USER_CART
            })
        } catch (error) {
            return dispatch({
                type: USER_ERRORS,
                payload: console.log( error )
            })
        }
    }
}
