import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import {Container, makeStyles} from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from 'axios';
import { numberWithCommas } from '../../utils';
import { headers } from "../../utils/GetHeaders"
const { REACT_APP_SERVER } = process.env;


const useStyles = makeStyles((theme) => ({
    root:{
        width: '100%',
        margin: "3vh",
        display: 'flex', 
        justifyContent: 'space-around',
        border: '1px solid black'
    },
    media: {
        width: "13%",
        backgroundSize: "contain",
      },

    img: {
      width: '10%',
      backgroundSize: 'contain',
      backgroundColor: 'grey'
    }
  }));

export default function Test() {
    const classes = useStyles()

    const [responsive, setResponsive] = useState("standard");
    const [tableBodyHeight, setTableBodyHeight] = useState("400px");
    const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  
    
    //   ["Gabby George", "Business Analyst", "Minneapolis"],
    //   [
    //     "Aiden Lloyd",
    //     "Business Consultant for an International Company and CEO of Tony's Burger Palace",
    //     "Dallas"
    //   ],
    //   ["Jaden Collins", "Attorney", "Santa Ana"],
    //   ["Franky Rees", "Business Analyst", "St. Petersburg"],
    //   ["Aaren Rose", null, "Toledo"],
    //   ["Johnny Jones", "Business Analyst", "St. Petersburg"],
    //   ["Jimmy Johns", "Business Analyst", "Baltimore"],
    //   ["Jack Jackson", "Business Analyst", "El Paso"],
    //   ["Joe Jones", "Computer Programmer", "El Paso"],
        
    

    const [orders, setOrders] = useState([])
    console.log(orders)

    const getOrders = async () => {      //me traigo las compras
        try{
           const response = await axios.get(`${REACT_APP_SERVER}/orders`, { headers })
            setOrders(response.data)
        }
        catch (error){
            console.log(error)
        }
      }

    useEffect(() => {
      getOrders()

    }, [])
  
    const columns = ["Factura", "Productos", "Ingreso", "Status", "Cliente", "Ubicacion"];
  
    const options = {
      filter: true,
      filterType: "dropdown",
      responsive,
      tableBodyHeight,
      tableBodyMaxHeight,
      resizableColumns: true
    };


  
   
    const arr = orders.map((order) => ({
        "Factura": order._id,
        "Productos": order.products.map((product) => <img src ={product.image} className={classes.media}/>),
        "Ingreso": order.products.reduce((acc, item) => {
            return (
                acc += item.price
            )
        }, 0),
        "Status": order.status,
        // "Cliente": order.buyer.email,
        "Ubicacion": order.shipping,
        "Cliente": order.buyer && order.buyer.email

    }))
    const data = arr
    console.log(data)

    return (
      
       <Container style ={{marginBottom: '1000px'}}>

      
       
        <MUIDataTable
          title={"Historial de Ventas"}
          data={data}
          columns={columns}
          options={options}
          
                 
        />
         </Container>
        
        )
}