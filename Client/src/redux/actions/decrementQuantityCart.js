import { DECREMENT_QUANTITY_ITEM, USER_ERRORS } from ".";
import axios from 'axios'



export const decrementQuantityCart = ( id ) => {
    const { REACT_APP_SERVER } = process.env
    return async(dispatch) => {

        try {
            const item = await axios.get(`${REACT_APP_SERVER}/products/${id}`)
            return dispatch ({
                type: DECREMENT_QUANTITY_ITEM,
                payload : item.data
            })

        } catch (error) {
            return dispatch({
                type: USER_ERRORS,
                payload: console.log(error)
            })
        }
    }

    
}
