import {ITEMS_DB_TO_CART, USER_ERRORS} from './index'
const { REACT_APP_SERVER } = process.env;


export const itemsDbToCart = ( value ) => {
    console.log('action', value)
    return (dispatch) => {
        try {
            return dispatch({
                type: ITEMS_DB_TO_CART,
                payload: value
            })
        } catch (error) {
            return dispatch({
                type: USER_ERRORS,
                payload: console.log(error)
            })
        }
    }
}
