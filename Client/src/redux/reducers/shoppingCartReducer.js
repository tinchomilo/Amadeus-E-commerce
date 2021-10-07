import { ADD_TO_CART, CLEAN_CART, DELETE_ONE_ITEM, DECREMENT_QUANTITY_ITEM, ITEMS_DB_TO_CART } from "../actions"

const initialState = {
    cart:[]
}

const shoppingCartReducer = ( state = initialState, action ) => {  
    
    switch( action.type ){
        
        case ADD_TO_CART:
           const itemAdded = state.cart.find( elem => elem._id === action.payload._id )           
           return itemAdded ? {
               ...state,
               cart: state.cart.map( elem => 
                elem._id === action.payload._id
                ?{...elem, quantity: elem.quantity + 1 }
                : elem
                ),
               }
               :{
                   ...state,
                   cart: [...state.cart, {...action.payload, quantity: 1}]
               }        
        case DECREMENT_QUANTITY_ITEM:
            const item = state.cart.find( elem => elem._id === action.payload._id )
            
            return item.quantity > 1 ?{
                ...state,
                cart: state.cart.map( elem => elem._id === action.payload._id
                    ? {...elem, quantity: elem.quantity - 1 }
                    : elem),
            }: null

        case DELETE_ONE_ITEM:         
            return {
                ...state,
                cart: state.cart.filter( elem => elem._id !== action.payload)
            }
        
        case CLEAN_CART:
            return {
                ...state,
                cart: []
            }

        case ITEMS_DB_TO_CART:
            console.log('reducer', action.payload)
            if(action.payload.length) {
                const itemsFromDb = action.payload.map( (elem) => {
                    return{
                        quantity: elem.quantity,
                        brand: elem._id.brand,
                        categories: elem._id.categories,
                        description: elem._id.description,
                        image: elem._id.image,
                        name: elem._id.name,
                        price: elem._id.price,
                        quelification: elem._id.qualification,
                        stock: elem._id.stock,
                        _id: elem._id._id
                    }
                })
                return {
                    ...state,
                    cart: itemsFromDb/* .concat(state.cart) */
                }
            }
        
        default:
            return state
    }      
}

export default shoppingCartReducer
