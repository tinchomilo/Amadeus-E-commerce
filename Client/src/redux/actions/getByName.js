import axios from "axios"
import { GET_ALL_PRODUCTS } from "./index"
const { REACT_APP_SERVER } = process.env;

export function getByName(name) {
    return async (dispatch) => {
        try {
            dispatch({
                type: GET_ALL_PRODUCTS,
                payload: {
                    data: [],
                    success: undefined,
                    error: undefined,
                    loading: true
                }
            })
            const products = await axios.get(`${REACT_APP_SERVER}/products?name=${name}`)
            if (products.status === 200) {
                return dispatch({
                    type: GET_ALL_PRODUCTS,
                    payload: {
                        data: products.data,
                        success: true,
                        error: undefined,
                        loading: false
                    }
                })
            } else {
                return dispatch({
                    type: GET_ALL_PRODUCTS,
                    payload: {
                        data: [],
                        success: false,
                        error: products.status,
                        loading: false
                    }
                })
            }
        }
        catch (error) {
            return dispatch({
                type: GET_ALL_PRODUCTS,
                payload: {
                    data: [],
                    success: false,
                    error: error,
                    loading: false
                }
            })
        }
    }
}
