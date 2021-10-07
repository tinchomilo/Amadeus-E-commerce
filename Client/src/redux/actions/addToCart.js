import axios from 'axios';
import { ADD_TO_CART, USER_ERRORS } from ".";

const addToCart = ( id ) => {

    const { REACT_APP_SERVER } = process.env
   
    return async( dispatch ) =>{

        try {
            const itemAdded = await axios.get(`${REACT_APP_SERVER}/products/${id}`)
            return dispatch ({
                type: ADD_TO_CART,
                payload : itemAdded.data
            })
            
        } catch (error) {
            return dispatch({
                type: USER_ERRORS,
                payload: console.log( error )
            })
        }
        
    }
    
}
export default addToCart
