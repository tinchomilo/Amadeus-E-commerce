import axios from "axios";
const { REACT_APP_SERVER } = process.env;

// FUNCIONES REUTILIZABLES

//AGREGA UN PUNTO AL PRECIO
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //valida la palabra ingresada en el componente AddCategory.jsx
export function validar( name, arr ) {
  name = name.trim();
  const result = arr.find( elem => elem.name.toLocaleLowerCase() === name.toLocaleLowerCase() ) 
  if( result ){
    return true
  }
  return false
}

export async function getCart( id ) {
  const itemsDbToCart = await axios.get(`${REACT_APP_SERVER}/users/${id}/cart`)
  return itemsDbToCart ? itemsDbToCart : null

}