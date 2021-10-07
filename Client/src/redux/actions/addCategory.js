import axios from "axios"
import { ADD_CATEGORY, USER_ERRORS } from "."
import { headers } from "../../utils/GetHeaders"
const { REACT_APP_SERVER } = process.env;

export const addCategory = (  name  ) => {
    return async( dispatch ) => {
        try {
            await axios.post(`${REACT_APP_SERVER}/categories`, { name }, { headers })
            dispatch({
                type: ADD_CATEGORY
            })

        } catch (error) {
            return dispatch( {
                type: USER_ERRORS,
                payload: console.log( error )
            })
        }
    }
}
