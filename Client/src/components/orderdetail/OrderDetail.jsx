import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {makeStyles, CssBaseline, AppBar, Container, Typography, Divider, Box, CardMedia, Table, TableHead, TableRow, TableCell, TableBody, InputLabel} from '@material-ui/core';
import MailIcon from "@material-ui/icons/Mail";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { numberWithCommas } from '../../utils';
import NavSecondary from '../navsecondary/NavSecondary';
import { headers } from "../../utils/GetHeaders"
import { InfoRounded } from '@material-ui/icons';
import Order from '../order/Order';
import cleanCart from "../../redux/actions/cleanCart";
import { linkUserCart } from "../../redux/actions/linkUserCart";
import { UserContext } from '../shoppingcart/UserContext';

const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  rootProduct: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '12vh',
    padding: '2vh',
    margin: '2vh',
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    borderRadius: '3%',
    backgroundColor: 'white',


  },
  media: {
    width: "50vh",
    margin: "0vh",
    backgroundSize: "contain",
    "&:hover": {
      backgroundSize: "larger",
    },
  },
  img: {
    width: "20%",
    backgroundSize: "contain",
  },
  img2: {
    width: '15%',
    backgroundSize: 'contain',

  },
  container: {
    height: "100vh",
    width: "100%",
    marginTop: "1vh",
    display: "flex",
    backgroundColor: "RGB(238, 238, 238)",
  },
  icon: {
    width: "8vh",
    backgroundSize: "contain",
    margin: "auto",
  },
  box: {
    display: "flex",
    justifyContent: "row",
  },
  containerDer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: "60%",
    height: '80%',
    backgroundColor:'RGB(245, 245, 244)',
    borderRadius: '5px',
    padding:'5vh',
    marginTop: '5vh'
  },
  text:{
    color: theme.palette.primary.light
  },
  link: {
    color: theme.palette.primary.dark,
    textDecoration: 'none',
    "&:focus": {
      color: theme.palette.primary.light
    }
  },
}));

export default function OrderDetail() {
  const classes = useStyles();

  const order = useSelector((state) => state.app.order); //me traigo el orderId generado en Order
  const user = useSelector((state) => state.app.user);

  const [infoOrder, setInfoOrder] = useState({});
  const [orderUpdated, setOrderUpdated] = useState({})
 
 

  console.log(order);
  console.log(orderUpdated)

  
  const dispatch = useDispatch()
  const { shoppingCart, setShoppingCart } = useContext(UserContext);
  const { cartQuantity } = shoppingCart;

  
  const query = new URLSearchParams(useLocation().search);
  const status = query.get("status");

  useEffect(() => {
    axios.put(`${REACT_APP_SERVER}/orders/stock/${order?._id}`, { status: status })
    .then(response => axios.post(`${REACT_APP_SERVER}/users/${order.buyer?._id}/purchaseEmail`, response.data, {headers}))
    .catch(error => console.log(error))

    if(status==='approved'){
      let obj = {
        user,
        cart: [],
      };
      // user?.cart = [];
      dispatch(linkUserCart(obj));
      dispatch(cleanCart())
    }
  }, [status])

 

    return (
        <div>
         <CssBaseline>
         <NavSecondary shipping ={order?.shipping} success={orderUpdated.status} />

        

          {
            status === "approved" && 
            <Container className={classes.containerDer} >

              <Container style={{marginBottom:'13vh', marginTop: '3vh'}} >
              <Typography component ="h2" variant= "body" >
                Tu compra fue un exito!
                </Typography>
                <InputLabel component = 'h3'>
                      Entre 24 y 48hs va estar arribando a tu domicilio: 
                      {/* <ArrowRightAltIcon style={{marginBottom: '-1vh', color: 'blue', marginLeft: '1vh'}} /> */}
                      <Box style={{display: 'flex' , justifyContent:'row'}}>
                      <LocationOnIcon className={classes.text} /> 
                      <Typography className={classes.text} style={{fontSize:'0.8em', marginTop: '1vh',marginLeft: '1vh'}}>
                        {order?.shipping?.street && `${order?.shipping?.street} ${order?.shipping?.number}, ${order?.shipping?.state}`}
                      </Typography>
                      </Box>
                </InputLabel>
                <InputLabel component = 'h3'>
                  Te enviamos un mail con toda la informacion del envio a: 
                  
                  <Box style={{display: 'flex' , justifyContent:'row'}}>
                  <MailIcon className={classes.text} /> 
                  <Typography className={classes.text} style={{fontSize:'0.8em', marginTop: '1vh',marginLeft: '1vh'}}>
                    {order?.buyer.email}
                  </Typography>
                  </Box>
                  </InputLabel>
              </Container>  
              <Container style={{marginTop:'-15vh'}}>
              {    
                order?.products &&

                  order?.products?.map((product) => {
                    return (
                  
                    <Link to={`/detail/${product._id}`}  className ={classes.link}> 
                    <Container className={classes.rootProduct}>
                      <Box >
                        <Typography variant="p" color ="primary">
                            {product.name}
                        </Typography>
                      </Box>
                      <CardMedia style={{display:'flex', justifyContent:'flex-end'}} 
                        image={product.image} 
                        className = {classes.img2}>
                    
                      </CardMedia>

                    </Container> 
                    </Link>
                    )
                  })

              }
                <Container>
                  <Table>

                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant ="overline" style={{textDecoration: 'underline', fontSize: '1.1em'}}>Envio
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant ="overline" style={{textDecoration: 'underline', fontSize: '1.1em'}}>Total Compra
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                            <Typography variant ="body1">
                                $ {order?.cost}
                            </Typography>
                          </TableCell>

                        <TableCell>
                          
                            {   order?.products && 
                              <Typography variant ="body1">
                              $ {numberWithCommas( order?.products?.reduce((acc, item) => {
                                const quant = order.quantity ? order.quantity : item.quantity
                                return (
                                acc += item.price * quant //aca hay que agregarle * quantity
                                )
                              }, 0
                              ) + order?.cost )
                              }
                                </Typography>
                          
                            } 
                          
                        </TableCell> 
                        
                    </TableRow>
                  </TableBody>             
                  </Table>
                </Container>
              

              </Container>
            </Container> // englobador---------------------------------------------------------
          }

          {
            status !== "approved" && 
            <Container className={classes.containerDer}> 
                <Typography component ="h2" variant= "body" >
                Algo paso con tu pago, por favor vuelve a intentar
                </Typography>
                {
                  order?.products.lenght === 1 ? 
                  //link a order/:id de un solo producto, o sea el id del product
                  <Link to={`/order/${order?.products[0]?._id}`}  className ={classes.link}>  
                  <Container className={classes.rootProduct}>
                    hola
                   </Container>
                  </Link>
                  :
                  null //link a ordercart
                }
                

            </Container>
          }

            
       
  
              

           

       


      </CssBaseline>
    </div>
  );
}
