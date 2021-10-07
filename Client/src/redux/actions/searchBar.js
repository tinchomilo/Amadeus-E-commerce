import { SET_SEARCHBAR } from "./index"

export function setSearchBar(query) {
    return {
        type: SET_SEARCHBAR,
        payload: query
    }
}