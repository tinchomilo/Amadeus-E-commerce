import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {Modal, Fade, Box, Backdrop, Container, CardMedia, Typography, Divider, Button, CssBaseline, Checkbox, Radio,Table, TableHead, TableRow, TableCell, TableBody, InputLabel, TextField, FormControl,makeStyles} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import PublicIcon from '@material-ui/icons/Public';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import LocalShippingIcon from '@material-ui/icons//LocalShipping';
import zonas from './zonas.png';
import axios from 'axios';
import ProcesoEnvios from './ProcesoEnvio.png';
import { numberWithCommas } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import addOrder from '../../redux/actions/addOrder';
import { useAuth0 } from '@auth0/auth0-react';
import NavSecondary from '../navsecondary/NavSecondary';
import { headers } from "../../utils/GetHeaders"
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
    
    container: {
        height: '100%',
        width: '100%',
        marginTop: '10vh', 
        display: 'flex',
        backgroundColor: 'RGB(238, 238, 238)'
    },
    containerIzq: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: "60%",
      height: '75vh',
      backgroundColor:'RGB(245, 245, 244)',
      margin: '2%',
      paddingTop: '2%',
      paddingBottom: '2%',
      borderRadius: '5px',
    
    },
    root: {      
      display: 'flex',
      flexDirection:'row',
      justifyContent: 'space-between',
      width: '100%',  
      margin: '0.5vh',
      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
      "&:hover": {
        boxShadow: "0 10px 40px 0px rgba(0,117,49,0.3)",
        borderLeft: `3px solid ${theme.palette.primary.light}`,
      },
      padding: '3vh',
      borderRadius: '3%',
      backgroundColor: 'white'
    },
    rootProduct: {      
      display: 'flex',
      flexDirection:'row',
      width: '100%', 
      height:'12vh',  
      marginTop: '1vh',  
      padding:'3vh', 
      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
      borderRadius: '3%',
      backgroundColor: 'white'
    },
    map: {
      display: 'flex',
      flexDirection:'row',
      justifyContent: 'space-between',
      width: '100%',
      flexGrow: 1,
      margin: '0.5vh',
      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
      padding: '3vh',
      borderRadius: '3%',
      backgroundColor: 'white'
    },
    containerDer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent:'space-around',
      alignItems: 'center',
      width: "35%",
      height: '100vh',
      backgroundColor:'RGB(245, 245, 244)',
      borderRadius: '5px',
        
        
    },
    button: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.light
      },
      height: '6vh',
      width: '20vh',
      fontSize: '70%'
    },
    address:{
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      height: '6vh',
      width: '17vh',
      fontSize: '75%',
      "&:hover": {
        backgroundColor: 'rgb(0, 139, 183)'
      },
    },
    icon: {
      width: '8vh',
      backgroundSize: 'contain',
      margin: 'auto'
    },
    img: {
        width: '20%',
        backgroundSize: 'contain',
        
    },
    img2: {
      width: '15%',
      backgroundSize: 'contain',
      
  },
    truck:{
      height: '30%',
      "&:hover":{
        backgroundColor: theme.palette.primary.light
      },
    },
    earth: {
      marginTop:'-5vh', 
      height: '30%',
      "&:hover":{
        backgroundColor: theme.palette.primary.light
      },
      marginLeft: '-0.5vh'
      
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      height:'80vh',
      width:'100vh'
    },
    zones: {
      width:'100%',
      height: '100%',
      backgroundSize: 'contain',
    },
    msg: {
      fontStyle: 'italic'
    },
    text: {
      fontSize: 12,
      color: theme.palette.primary.dark
    },
    edit: {
      backgroundColor: 'rgb(0, 139, 183)',
      color: theme.palette.primary.contrastText,
      height: '4vh',
      width: '15vh',
      fontSize: '70%',
      "&:hover": {
        backgroundColor: 'rgb(0, 139, 183)'
      },
    }
  }));         
 
  export default function Order() {
    const classes = useStyles()
    const { user } = useAuth0();
    
    const dispatch = useDispatch()
    const cartProducts = useSelector(state => state.cart.cart)
    const userRedux = useSelector((state) => state.app.user);
    const [quantity, setQuantity] = useState(1)
    const [idOrder, setIdOrder] = useState()
    const [selectedValue, setSelectedValue] = useState('');
    const [zones, setZones] = useState(false)
    const handleZones = () => setZones(true)
    
    const [policy, setPolicy] = useState(false)
    const handlePolicy = () => setPolicy(true)
    const handleClose = () =>{
      setZones(false)
      setPolicy(false)
    }
    const [shipping, setShipping] = useState(0)
    const [ next, setNext ] = useState(false)

    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState(false)
    const [userDb, setUserDb] = useState({})

    

     //------ESTADO PARA AGREGAR DATOS DE ENVIO --------------//
    const initialInput = {
      street: "",
      state: "",
      number: "",
      floor: "",
      between: "",
      zip: "",
      cost: ""
    };
    const [input, setInput] = useState(initialInput);
    const [shippingAddress, setShippingAddress] = useState({})
    //------ESTADO PARA AGREGAR DATOS DE ENVIO --------------//
    const getUserById = async () => {
      try{
         const response = await axios.get(`${REACT_APP_SERVER}/users/${userRedux._id}`, { headers })
          setUserDb(response.data)
          setShippingAddress(response.data.shipping[0])
      }
      catch (error){
          console.log(error)
      }
    }
    

    useEffect(() => {
      getUserById(userRedux?._id) 
    }, [userRedux])


    useEffect(() => {            
      dispatch(addOrder(idOrder))
    },[idOrder])


    const handleCheckout = () => {
     
      axios.post(`${REACT_APP_SERVER}/orders`, { products: cartProducts, user: user, shipping:  shippingAddress, cost: shipping   })
      .then((response) => setIdOrder(response.data)) 
  
      .catch((err) => console.log(err))
      
      axios.post(`${REACT_APP_SERVER}/mercadopago/cart`, {cartProducts, shipping: shipping})
      .then((response) => window.location = response.data )
      .catch((err) => console.log(err))
    }
  
    const handleShipping = (e) => {
      if(e.target.value === '1' && selectedValue === 'domicilio') setShipping(350)
      if(e.target.value === '2' && selectedValue === 'domicilio') setShipping(500)
      if(e.target.value === '3' && selectedValue === 'domicilio') setShipping(750)
    }
    
    
    const handleAddress = () => {
      setAddress(!address)
    }
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      if(event.target.value === 'tienda') setShipping(0)
      if(event.target.value === 'domicilio') setShipping(350)
      setOpen(false)
    };
    const handleToggle = () => setOpen(!open);
    const handleInputChange = (e) => {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
    }
    const handleSave = (e) => {
      e.preventDefault()
      //aca deberiamos guardar tambien los datos de envio en User en nuestra db
      axios.post(`${REACT_APP_SERVER}/users/${userRedux._id}/shipping`, { shipping: input }, { headers } )
      // .then((response) => dispatch(addOrder(response.data)))
      .then(() => setShippingAddress(input))
      .then(() => setNext(true))
      .catch((err) => console.log(err) )
      setInput(initialInput)
    }
    const handleQuantity = (e) =>{
      setQuantity(e.target.value)
    }

   
  
    return (
      <div>
        <CssBaseline>
         <NavSecondary style={{marginBottom: '5vh'}} shipping = {userDb?.shipping}  />
         <Container className={classes.container}>
          
          <Container className={classes.containerIzq}>
           <Box>
            <Typography component ="h3" variant= "h5" style = {{marginTop: '-2vh', marginBottom: '5vh'}}>
              ¿Como queres recibir o retirar tu compra?
            </Typography>
            <Box style={{display:'flex',   justifyContent: 'center'}}>
                <InputLabel component = 'h3'style = {{marginTop: '-3vh', marginBottom: '3vh', display:'flex',   justifyContent: 'center'}}>
                  Conoce las areas de Cobertura <ArrowRightAltIcon style={{marginTop:'-0.5vh', color: 'blue', marginLeft: '1vh'}} />
                  
                </InputLabel>
                <Button className={classes.earth} onClick={handleZones}>
                  <PublicIcon />
                </Button>
                 
              </Box>
              <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={zones}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Container className={classes.paper}>
                      <img src={zonas} className={classes.zones} />          
                   </Container>
                </Modal>
           </Box>
           <Container className={classes.root}>
              <Typography component ="h1" variant = "body1">
                  <Radio 
                    checked={selectedValue === 'domicilio'}
                    onChange={handleChange}
                    value="domicilio"
                    name="radio-buttons" />
                    Recibe tu Compra en tu domicilio
                </Typography>
                
                
                <InputLabel style ={{marginTop:'1.7vh', fontSize: '90%'}}>Elige tu zona</InputLabel>
                 <ArrowRightAltIcon style={{marginTop:'1vh', marginLeft: '-3vh',color:'blue'}}/>
                <TextField type="number"  defaultValue="1" inputProps={ {min :"1", max :"3"}} size= 'small'   onChange={handleShipping} style={{marginLeft: '-2vh'}} />
               
               {
                 selectedValue === 'domicilio'&& 
                 <Box style={{marginTop:'-1vh'}}>
                 { shippingAddress ?
                    <InputLabel  style={{fontSize:'0.95em', margin:'1vh'}} >
                    { (`${shippingAddress.street} ${shippingAddress.number}, ${shippingAddress.state}`).substring(0,30) }
                    </InputLabel>
                    :
                    <InputLabel  style={{fontSize:'0.95em', margin:'1vh'}} >
                    { userDb.shipping[0] ?  `${userDb.shipping[0].street} ${userDb.shipping[0].number}, ${userDb.shipping[0].state}` : null }
                    </InputLabel>
                 }  
                  {
                        userDb?.shipping[0] ?
                        <Button variant = "contained" className={classes.edit}  endIcon={<EditIcon  />}onClick ={handleAddress} style={{marginLeft: '9vh'}}>
                        Modificar
                      </Button>
                       : 
                       <Button variant = "contained" className={classes.address}  endIcon={<AddLocationIcon  />}onClick ={handleAddress} style={{marginLeft: '9vh'}}>
                        Agregar
                      </Button>
                      }
                    </Box>
               } 
               
           </Container> 
           <Container className={classes.root}> 
                 <Box>
                   <Typography component="h1" variant = "body1">
                    <Radio
                      checked={selectedValue === 'tienda'}
                      onChange={handleChange}
                      value="tienda"
                      name="radio-buttons" />
                    Retirar Compra en la tienda
                   </Typography>
                 </Box>
                 <Box>
                   {
                     selectedValue === 'tienda' && 
                      <Button variant = "contained" className={classes.address} endIcon={<LocationOnIcon />} onClick={handleToggle}>
                        {!open && selectedValue === 'tienda'? "Ver" : "Ocultar"  }
                      </Button>
                   }
                                
                 </Box>
                 
           </Container> 
           {
             selectedValue === 'tienda' && open ?  <Container className={classes.map}>
                      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d535.8165387237323!2d-58.385068209148855!3d-34.60563648100992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac5a682a5db%3A0xf4c875597214559d!2sDowntown%20Music!5e0!3m2!1ses-419!2sar!4v1631805346279!5m2!1ses-419!2sar" style={{width: '100%', border:'0', height: '30vh'}} allowFullScreen="" loading ='lazy' ></iframe>
             
                   </Container> 
                   : null
           }
            {     //------------FORMULARIO PARA AGREGAR DATOS DE ENVIO------------------------------//
            selectedValue === 'domicilio' && address && !open ?
            <Box style={{margin:'2vh'}}>
            <form>  
              <TextField type ="text" placeholder="Provincia" style={{margin:'1vh'}} 
              name="state" value={input.state} onChange={handleInputChange}/>
              <TextField type ="text" placeholder="Calle" style={{margin:'1vh'}}
              name="street" value={input.street} onChange={handleInputChange}/>
              <TextField type ="number" placeholder="Numero" style={{margin:'1vh'}}
              name="number" value={input.number} onChange={handleInputChange}/>
              <TextField type ="text" placeholder="Piso y Numero" style={{margin:'1vh'}} 
              name="floor" value={input.floor} onChange={handleInputChange}/>
              <TextField type ="text" placeholder="Entre calles" style={{margin:'1vh'}}
              name="between" value={input.between} onChange={handleInputChange}/>
              <TextField type ="number" placeholder="CP" style={{margin:'1vh'}} 
              name="zip" value={input.zip} onChange={handleInputChange}/>
              <Button variant = "contained" className={classes.address} endIcon={<AddLocationIcon />} onClick ={handleSave}>
                  Guardar
              </Button>
            </form>
            </Box>
            : null
            //------------FORMULARIO PARA AGREGAR DATOS DE ENVIO------------------------------//
          }  
          <Box style ={{display: 'flex', justifyContent: 'center'}}>
          <InputLabel 
            component = 'h3' 
            style = {{  display:'flex',   justifyContent: 'center', marginTop:'10vh'}}>
                  Algunda duda sobre tu envio? 
                  <ArrowRightAltIcon style={{marginTop:'-0.5vh', color: 'blue', marginLeft: '1vh'}} />     
            </InputLabel>
            <Button className={classes.truck} style={{marginTop: '8.5vh', marginLeft: '0vh'}}>
                <LocalShippingIcon onClick={handlePolicy}/>
             </Button>  
          </Box>
          <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={policy}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Container className={classes.paper}>
                      <img src={ProcesoEnvios} className={classes.zones} />          
                   </Container>
                </Modal>
          
          </Container>
          <Container className={classes.containerDer}>
            <Typography component ="h4" variant= "p" style = {{marginTop: '-4vh', alignSelf:'flex-start', marginLeft: '4vh'}}>
              Tus Productos:
            </Typography>
            <Container style={{marginTop:'-5vh'}}>
           
            { 
              cartProducts.map((product) => {
                return (
               
                <Container className={classes.rootProduct}>
                  <Box >
                    <Typography variant="p" color ="primary">
                        {product.name.substring(0,30) + '...'}
                    </Typography>
                  </Box>
                  
                  <CardMedia style={{display:'flex', justifyContent:'flex-end'}} 
                    image={`${REACT_APP_SERVER}/products/images/${product.image}`} 
                    className = {classes.img2}>
                
                  </CardMedia>
                  
                  
                
                </Container> 
                )
              }) 
              }
               <Button variant = "contained" style={{display:'flex',justifyContent:'flex-end',   marginLeft: '39vh'}}  className={classes.edit} endIcon={<EditIcon />} component={Link} to={`/cart`}>
                     Editar   
                </Button>
               
            </Container>
            <Table style={{marginTop:'-10vh'}}>
               <TableHead>
                 <TableRow>
                   <TableCell>
                      <Typography variant ="overline" style={{textDecoration: 'underline', fontSize: '1.1em'}}>Productos
                      </Typography>
                     </TableCell>
                   <TableCell>
                      <Typography variant ="overline" style={{textDecoration: 'underline', fontSize: '1.1em'}}>Envio
                      </Typography>
                     </TableCell>
                   <TableCell>
                      <Typography variant ="overline" style={{textDecoration: 'underline', fontSize: '1.1em'}}>Total
                      </Typography>
                     </TableCell>
                 </TableRow>
                 </TableHead>
                 <TableBody>
                   <TableRow>
                      <TableCell>
                      <Typography variant = 'body1'>
                            {
                              cartProducts[0]?.price && <Typography variant ='body1' >
                            $ {numberWithCommas(cartProducts.reduce((acc, item) => {
                              return (
                              acc += item.price * item.quantity 
                              )
                            }, 0
                            ))
                            }
                            </Typography> }
                            </Typography>
                        </TableCell>
                      <TableCell>
                        <Typography variant = 'body1'>
                            {selectedValue === 'domicilio' ?  `$ ${shipping}` : '$ 0'
                            }
                        </Typography>
                        </TableCell>
                      <TableCell>
                        <Typography variant = 'body1'>
                          {
                            cartProducts[0].price && <Typography variant ='body1' >
                          $ {numberWithCommas(cartProducts.reduce((acc, item) => {
                            return (
                             acc += item.price * item.quantity 
                            )
                        }, 0
                        ) + shipping )
                          }
                          </Typography> }
                        </Typography>
                      </TableCell>
                   </TableRow>
                 </TableBody>
            </Table>
            {  selectedValue === '' && !next && 
                <Typography variant='error' style={{color:'red'}}>
                  *Debes seleccionar envio o retiro
                </Typography>
             
             }              
          
          {   selectedValue !== '' &&         shippingAddress && 
              <Button variant="contained" className={classes.button} onClick ={handleCheckout}>
                    Continuar
             </Button>
             }
            
                
  
          </Container>
        </Container>
        
        </CssBaseline>
  
      </div>
    );
  }
  