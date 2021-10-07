import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk';
import appReducer from '../reducers/appReducer'
import authReducer from '../reducers/authReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers/rootReducer'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['app']
}

const composeEnhancers = (typeof window !==  'undefined'  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore( rootReducer, composeEnhancers( applyMiddleware( thunk ) ) );

export const persistor = persistStore(store);

export default { store, persistor }
