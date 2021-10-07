import { ADD_ORDER_ID,  } from "../actions/index";

 const addOrder = ( id ) => {
            return  {
                type: ADD_ORDER_ID,
                payload: id
            }
        }
export default addOrder;