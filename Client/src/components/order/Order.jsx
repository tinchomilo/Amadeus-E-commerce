import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import {Modal, Fade, Box, Backdrop, Container, CardMedia, Typography, Divider, Button, CssBaseline, Checkbox, Radio,Table, TableHead, TableRow, TableCell, TableBody, InputLabel, TextField, FormControl} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import PublicIcon from '@material-ui/icons/Public';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import LocalShippingIcon from '@material-ui/icons//LocalShipping';
import { makeStyles } from '@material-ui/core';
import zonas from './zonas.png'
import ProcesoEnvios from './ProcesoEnvio.png';
import axios from 'axios';
import { numberWithCommas } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import addOrder from '../../redux/actions/addOrder';
import { useAuth0 } from '@auth0/auth0-react';
import NavSecondary from '../navsecondary/NavSecondary';
import { headers } from "../../utils/GetHeaders"


const { REACT_APP_SERVER } = process.env;


const useStyles = makeStyles((theme) => ({
    media: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: '50px',
      width: '50%',
      backgroundSize: 'contain',
     
    },
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
        width: '30%',
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
      height: '3.5vh',
      width: '14vh',
      fontSize: '65%',
      "&:hover": {
        backgroundColor: 'rgb(0, 139, 183)'
      },
     
    }
  }));         
  
  export default function Order() {
    const classes = useStyles()
    const { user } = useAuth0();

    const dispatch = useDispatch()
    const userRedux = useSelector((state) => state.app.user);
   

 
    const { id } = useParams()
    
    const [detail, setDetail] = useState({})
    console.log(userRedux)
    const [quantity, setQuantity] = useState(1)

    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen(!open);
    
    const [selectedValue, setSelectedValue] = useState('');

    const [shipping, setShipping] = useState(0)
   
    const [ next, setNext ] = useState(false)

    const [address, setAddress] = useState(false)
    const handleAddress = () => {
      setAddress(!address)
    }
    
    const [userDb, setUserDb] = useState({})
    

    const [map, setMap] = useState(false)
    const handleMap = () => setMap(!map)

    const [zones, setZones] = useState(false)
    const handleZones = () => setZones(true)

    const [policy, setPolicy] = useState(false)
    const handlePolicy = () => setPolicy(true)

    const handleClose = () =>{
      setZones(false)
      setPolicy(false)
    }
      

    const [idOrder, setIdOrder] = useState()
    
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
    
    const getProductById = async () => {
      try{
         const response = await axios.get(`${REACT_APP_SERVER}/products/${id}`)
          setDetail(response.data)
      }
      catch (error){
          console.log(error)
      }
    }
    
    useEffect(() => {
      getProductById(id) 
    }, [])
   

    useEffect(() => {            
      dispatch(addOrder(idOrder))
    },[idOrder])

   

    const handleCheckout = () => {
      
      //en shipping pasarle o direccion nueva en caso de haber o la que ya tiene el usuario
      axios.post(`${REACT_APP_SERVER}/orders`, { products: detail, user: user, shipping:  shippingAddress, cost: shipping, quantity: quantity }, { headers })
      .then((response) => setIdOrder(response.data)) 
      .catch((err) => console.log(err))
      
      axios.post(`${REACT_APP_SERVER}/mercadopago/checkout`, { name: detail.name, price: detail.price , shipping: shipping, quantity: quantity})
      .then((response) => window.location = response.data )
      .catch((err) => console.log(err))
    }
  
    const handleQuantity = (e) =>{
      setQuantity(e.target.value)
    }
  
    const handleShipping = (e) => {
      if(e.target.value === '1' && selectedValue === 'domicilio') setShipping(350)
      if(e.target.value === '2' && selectedValue === 'domicilio') setShipping(500)
      if(e.target.value === '3' && selectedValue === 'domicilio') setShipping(750)
    }

    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      if(event.target.value === 'tienda') setShipping(0)
      if(event.target.value === 'domicilio') setShipping(350)
      setOpen(false)
    };

    const handleInputChange = (e) => {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
    }

    const handleSave = (e) => {
      e.preventDefault()
      axios.post(`${REACT_APP_SERVER}/users/${userRedux._id}/shipping`, { shipping: input }, { headers } )
      // .then((response) => dispatch(addOrder(response.data)))
      .then(() => setShippingAddress(input))
      .then(() => setNext(true))
      .catch((err) => console.log(err) )
      //aca deberiamos guardar tambien los datos de envio en User en nuestra db
      setInput(initialInput)
    }

    //habria que guardar el userDb.shipping en shippingAddress, y que si el usuario dedide modificar pise la direccion
    return (
      <div>
        <CssBaseline>
        <NavSecondary style={{marginBottom: '5vh'}} shipping = {userDb?.shipping} />

         <Container className={classes.container}>
          
          <Container className={classes.containerIzq}>

           <Box>
            
              <Typography component ="h3" variant= "h5" style = {{marginTop: '-2vh', marginBottom: '5vh'}}> ¿Como queres recibir o retirar tu compra?
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
                
                <InputLabel style ={{marginTop:'1.7vh',fontSize: '90%'}}>Elige tu zona</InputLabel>
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
                         { userDb.shipping[0] ? `${userDb.shipping[0].street} ${userDb.shipping[0].number}, ${userDb.shipping[0].state}` : null }
                         </InputLabel>

                      }

                      {
                        shippingAddress ?
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
            // al tocar guardar deberiamos guardarlo en base de datos y luego reflejarlo 
            //------------FORMULARIO PARA AGREGAR DATOS DE ENVIO------------------------------//
          }              
          
          <Box style ={{display: 'flex', justifyContent: 'center'}}>

            <InputLabel 
              component = 'h3' 
              style = {{  display:'flex',   justifyContent: 'center', marginTop:'10vh'}}>
                    Algunda duda sobre tu envio? 
                    <ArrowRightAltIcon style={{marginTop:'-0.5vh', color: 'blue', marginLeft: '1vh'}} />     
              </InputLabel>

              <Button className={classes.truck} style={{marginTop: '8.5vh', marginLeft: '0vh'} }>
                  <LocalShippingIcon onClick={handlePolicy} />
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


            <Box style = {{display:'flex', justifyContent:'center', marginTop: '3vh'}}>
                <CardMedia className={classes.media}> <img src={`${REACT_APP_SERVER}/products/images/${detail.image}`} className={classes.img} /> 
                </CardMedia>
             </Box>
             <Typography variant="h6" color ="primary" style={{marginTop: '-3vh'}}>
               {detail.name}
             </Typography>

             <Table style={{marginTop:'-3vh'}}>
               <TableHead>
                 <TableRow>
                   <TableCell>
                      <Typography variant ="overline" style={{textDecoration: 'underline', fontSize: '1.1em'}}>Producto
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
                        {detail.price && <Typography>$ {numberWithCommas(detail.price)}
                        </Typography>}
                        </TableCell>
                      <TableCell>
                        <Typography variant = 'body1'>
                            {selectedValue === 'domicilio' ?  `$ ${shipping}` : '$ 0'
                            }
                        </Typography>
                        </TableCell>
                      <TableCell>
                        <Typography variant = 'body1'>
                            {detail.price && <Typography variant ='body1' >
                          $ {numberWithCommas(detail.price * quantity + shipping)}
                          </Typography> }
                        </Typography>
                        
                      </TableCell>
                   </TableRow>
                 </TableBody>
              

             </Table>

            <Box style={{display:'flex', justifyContent:'space-evenly', width:'100%'}}>
                <InputLabel style ={{fontSize: '0.95em'}}>Stock Disponible: {detail.stock}</InputLabel>
                <InputLabel style ={{fontSize: '0.95em'}}>Cantidad:</InputLabel>
                 
                 <TextField type="number"  defaultValue="1" inputProps={ {min :"1", max : detail.stock}} onChange={handleQuantity} size= 'small' style={{marginTop:'-2vh', marginRight: '2vh'}} />
            </Box>
                  
             <Divider variant = "middle" style ={{width: '100%', marginTop: '-2vh', marginBottom: '-4vh'}}/>                 
             {  selectedValue === '' && !next && 
                <Typography variant='error' style={{color:'red'}}>
                  *Debes seleccionar envio o retiro
                </Typography>
             
             }  
          {   selectedValue !== '' && shippingAddress && 
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
  