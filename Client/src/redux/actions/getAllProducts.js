import axios from "axios"
import { GET_ALL_PRODUCTS, USER_ERRORS, SORT_BY_NAME, SORT_BY_PRICE, FILTER_BY_CATEGORY } from "./index"
const { REACT_APP_SERVER } = process.env;


const getAllProducts = () => {
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
            const products = await axios.get(`${REACT_APP_SERVER}/products`)
            return dispatch({
                type: GET_ALL_PRODUCTS,
                payload: {
                    data: products.data,
                    success: true,
                    error: false,
                    loading: false
                }
            })
        } catch (error) {
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

export function sortByName(order){
    return{
        type: SORT_BY_NAME,
        payload: {
            data: order,
            success: true,
            error: false,
            loading: false
        }
    }
}

export function sortByPrice(order){
    return{
        type: SORT_BY_PRICE,
        payload: {
            data: order,
            success: true,
            error: false,
            loading: false
        }
    }
}

export function filterByCategory(category){
    return{
        type: FILTER_BY_CATEGORY,
        payload: {
            data: category,
            success: true,
            error: false,
            loading: false
        }
    }
}

export default getAllProducts