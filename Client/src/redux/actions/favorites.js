import axios from "axios"
import { GET_ALL_FAVORITES, ADD_FAVORITE, DELETE_FAVORITE, REMOVE_ALL_FAVORITES, SORT_BY_NAME_FAVORITES, SORT_BY_PRICE_FAVORITES, FILTER_BY_CATEGORY_FAVORITES } from "./index"
import { headers } from "../../utils/GetHeaders"

const { REACT_APP_SERVER } = process.env;

export function getAllFavorites(idUser){
    return async (dispatch) => {
        try {
            const favorites = await axios.get(`${REACT_APP_SERVER}/users/${idUser}/favorites`, {headers})
            return dispatch({
                type: GET_ALL_FAVORITES,
                payload: favorites.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export function addFavorite(idUser, idProduct){
    return async( dispatch ) => {
        try {
            await axios.post(`${REACT_APP_SERVER}/users/${idUser}/favorites/${idProduct}`, {}, {headers})
            dispatch({
                type: ADD_FAVORITE
            })

        } catch (error) {
            console.log(error)
        }
    }
}

export function deleteFavorite(idUser, idProduct){
    return async( dispatch ) => {
        try {
            await axios.delete(`${REACT_APP_SERVER}/users/${idUser}/favorites/${idProduct}`, {headers})
            dispatch({
                type: DELETE_FAVORITE
            })

        } catch (error) {
            console.log(error)
        }
    }
}

export function removeAllFavorites() {
    return (dispatch) => {
        dispatch({
            type: REMOVE_ALL_FAVORITES
        })
    }
}

export function sortByNameFavorites(order){
    return{
        type: SORT_BY_NAME_FAVORITES,
        payload: order
    }
}

export function sortByPriceFavorites(order){
    return{
        type: SORT_BY_PRICE_FAVORITES,
        payload: order
    }
}

export function filterByCategoryFavorites(category){
    return{
        type: FILTER_BY_CATEGORY_FAVORITES,
        payload: category
    }
}