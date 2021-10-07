import axios from "axios"
import { GET_ALL_REVIEWS, REMOVE_ALL_REVIEWS } from "./index"
const { REACT_APP_SERVER } = process.env;

export function getAllReviews(){
    return async (dispatch) => {
        try {
            const reviews = await axios.get(`${REACT_APP_SERVER}/reviews`)
            return dispatch({
                type: GET_ALL_REVIEWS,
                payload: reviews.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export function removeAllReviews() {
    return (dispatch) => {
        dispatch({
            type: REMOVE_ALL_REVIEWS
        })
    }
}