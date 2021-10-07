import {combineReducers} from 'redux'
import { persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authReducer'
import appReducer from './appReducer'
import shoppingCartReducer from './shoppingCartReducer'

const persistConfig = {
        key: 'root',
        storage,
        whitelist: ['cart', 'app']
    }

const rootReducer = combineReducers({
    // auth: authReducer,
    cart: shoppingCartReducer,
    app: appReducer
});

export default persistReducer(persistConfig, rootReducer);