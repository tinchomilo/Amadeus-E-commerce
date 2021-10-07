import { CLEAN_CART } from "."

const cleanCart = () => {
    return ( dispatch ) => {
        return dispatch({
            type: CLEAN_CART,
            payload: []
        })
    }
}

export default cleanCart
