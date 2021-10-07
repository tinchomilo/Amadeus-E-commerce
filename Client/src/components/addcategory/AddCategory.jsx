import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, FormHelperText, Input, InputLabel, Button, Typography, Container} from '@material-ui/core';
import ReplyRoundedIcon from '@material-ui/icons/ReplyRounded';
import { useDispatch } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { HomeRounded } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { validar } from '../../utils';
import NavSecondary from '../../components/navsecondary/NavSecondary'
import MaterialTable from 'material-table';
import {FirstPage, AddBox, tableIcons} from './tableIcons';
import Edit from '@material-ui/core/Icon';
import axios from 'axios';
import {Add} from './tableIcons'
import SaveRounded from '@material-ui/icons/SaveRounded'
import { headers } from '../../utils/GetHeaders'
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          margin: theme.spacing(2),
        },
      },
      modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',        
      },
      paper: {
        backgroundColor: '#808080',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        color:'white',
        fontStyle: 'italic',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      msg: {
        fontStyle: 'italic',        
      },
      boxes: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    rootTable: {
      '& .MuiIconButton-colorInherit' : {
          // color: '#003E1C'
      },      
      '& > *': {
        margin: theme.spacing(2),
      },
  },
    

    }));     

export const AddCategory = ( { history} ) => {
    const classes = useStyles();    
    const dispatch = useDispatch()
    const categories = useSelector(state => state.app.categoriesLoaded)
    const [data, setData] = useState([])
    const [errors, setErrors] = useState(false)  
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false)
    const [openErrorLength, setOpenErrorLength] = useState(false)
    const [categoryDeleted, setCategoryDeleted] = useState(false)
    const [categoryUpdated, setCategoryUpdated] = useState(false)
    
   const columns=[
   {
     title: 'Categoría',
     field: 'name',
     cellStyle: {
              backgroundColor: '#78C498',
              color: '#000',
              alignItems: 'center'
            },
    headerStyle: {
              backgroundColor: '#000A00',
              },
   }]

    useEffect( () =>{
      axios.get(`${REACT_APP_SERVER}/categories`)
      .then(response=>{
        setData(response.data);
       }).catch(error=>{
         console.log(error);
       })     
    }, [open, categoryDeleted, categoryUpdated])

    const handleClose = () => {
        setOpen(false);
      };

      const handleCloseError = () => {
        setOpenError(false);
      };

      const handleCloseErrorLength = () => {
        setOpenErrorLength(false);
      };

      const closeCategoryDeleted = () => {
        setCategoryDeleted(false);
      };

      const closeCategoryUpdated = () => {
        setCategoryUpdated(false);
      };

      const handleReturn = () => {
        history.goBack()
      }

    return (
      <>
        <NavSecondary />

        <Container style ={{marginTop: '50px'}} className={classes.rootTable}>
          <Typography variant='h3' align='center'>
            Agregar, editar o eliminar categorías
          </Typography>

          <MaterialTable        
         
            stickyHeader aria-label="sticky table"         
            icons={tableIcons}
            columns={columns}
            data={data}
            title={'Lista de categorías existentes'}
            editable={{
              onRowAdd: (newRow) => new Promise( (resolve, reject) =>{
                const {name} = newRow 
                  if( name.trim().length > 3  ) {    
                    if( validar( name, categories ) ){
                      setOpenError(true)
                      reject()
                    } else {        
                      axios.post(`${REACT_APP_SERVER}/categories`, {name}, {headers} )
                        .then(response=>{                          
                          const updatedRows= [...data, newRow]
                          setData(updatedRows);
                          resolve()
                        }).catch( error=>{
                          reject()
                          console.log('error', error);
                        })                     
                      setOpen( true )
                      setErrors( false )                      
                      }
                  } else {  
                    setOpenErrorLength( true )
                    reject()                    
                  }                            
              }),
              onRowDelete: selectedRow => new Promise( ( resolve, reject) => {
                axios.delete( `${REACT_APP_SERVER}/categories/${selectedRow._id}`, {headers} )
                .then(response =>{
                  setData(data.filter( (elem) => elem._id !== selectedRow._id ))
                  resolve()
                  setCategoryDeleted(true)
                }).catch( error =>{
                 console.log( error )
                 reject() 
                })
              }),
              onRowUpdate: ( updatedRow, oldRow ) => new Promise( ( resolve, reject) => {
                const {name} = updatedRow
                axios.put( `${REACT_APP_SERVER}/categories/${oldRow._id}`, { name }, {headers} )
                .then( response => {
                  let newData = data                
                  newData.map( (elem) => {
                    if(elem._id === updatedRow._id){
                      elem.name = updatedRow.name
                    }
                  })
                  setData(newData)
                  resolve()
                  setCategoryUpdated(true)
                }).catch( error => {
                  console.log( error )
                  reject()
                })
              }),               
            }}            

            options={{
              actionsColumnIndex: -1, addRowPosition: 'first',              
              rowStyle: {
                backgroundColor: '#78C498',
                fontSize: '1.5rem',                
              },              
              headerStyle: {
                backgroundColor: '#000A00',
                color: '#FFF',
                fontSize: '1.1rem',
                fontStyle: 'italic'
                }             
            }}
            localization={{
                header: {
                    actions: 'Acciones'
                }
            }} 
          />
          <Box className={classes.boxes}>
            <Button
              onClick={ handleReturn }
              variant="contained" 
              color="primary"
              endIcon={<ReplyRoundedIcon />}
              
              >
              regresar
            </Button>  

            <Button 
              component={ Link } to='/'
              variant='contained'
              color='primary'
              endIcon={<HomeRounded />}
            >
              Home
            </Button>    
          </Box>         
        </Container>

        <div>      
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
              >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Creacion exitosa</h2>   
                        <p id="transition-modal-description">Click para cerrar</p>         
                    </div>
                </Fade>
            </Modal>
        </div>

            <div>      
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openError}
                    onClose={handleCloseError}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                  >
                    <Fade in={openError}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">La categoria ya existe!!</h2>
                            <p id="transition-modal-description">Click para cerrar</p>            
                        </div>
                    </Fade>
                </Modal>
            </div>

            <div>      
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openErrorLength}
                    onClose={handleCloseErrorLength}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                  >
                    <Fade in={openErrorLength}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">Debe ser mayor a 3 caracteres!!</h2>
                            <p id="transition-modal-description">Click para cerrar</p>            
                        </div>
                    </Fade>
                </Modal>
            </div>

            <div>      
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={categoryDeleted}
                    onClose={closeCategoryDeleted}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                  >
                    <Fade in={categoryDeleted}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">Categoria eliminada con exito!!</h2>
                            <p id="transition-modal-description">Click para cerrar</p>            
                        </div>
                    </Fade>
                </Modal>
            </div>

            <div>      
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={categoryUpdated}
                    onClose={closeCategoryUpdated}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                  >
                    <Fade in={categoryUpdated}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">Categoria modificada con exito!!</h2>
                            <p id="transition-modal-description">Click para cerrar</p>            
                        </div>
                    </Fade>
                </Modal>
            </div>
        </>   
      );
}
