import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import NavSecondary from '../navsecondary/NavSecondary';
import { getAllUsers } from '../../redux/actions/users';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { Grid, Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Snackbar } from '@material-ui/core';
import { headers } from "../../utils/GetHeaders"
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: '#8e0000',
        color: '#ffffff',
    },
    tableCell:{
        padding:'1vw',
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
    },
}));


export default function UserManagement(){

    const classes = useStyles();

    const users = useSelector(({ app }) => app.usersLoaded);
    console.log(users)
    const dispatch = useDispatch();
    const history = useHistory();

    const [open, setOpen] = useState(false);
    // const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch(getAllUsers());
    },[users])
    

    async function handlePrivileges(user){
        user.isAdmin = !user.isAdmin;
        await axios.put(`${REACT_APP_SERVER}/users/${user._id}`, user, { headers });
        dispatch(getAllUsers());
    }

    async function handleDelete(id){
        await axios.delete(`${REACT_APP_SERVER}/users/${id}`, { headers });
        dispatch(getAllUsers());
        // setOpenModal(false);
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setOpen(false);
    };

    const handleBlock = (sub) => {
        axios.get(`${REACT_APP_SERVER}/users/block/${sub}`, {headers})
    };

    const handleDesblock = (sub) => {
        axios.get(`${REACT_APP_SERVER}/users/desblock/${sub}`, {headers})
    };

    // function handleOpenModal(){
    //     setOpenModal(true);
    // }

    // function handleCloseModal(){
    //     setOpenModal(false);
    // }


    return (
        <>
            <NavSecondary />
            <Grid container component="main" style={{marginTop:'12vh'}}>
                <Container component={Paper} style={{ maxWidth: '95vw', minWidth: '65vw' }}>
                    {/* <Grid container justifyContent="center">
                        <Button onClick={() => (history.push('/'))}>Home</Button>
                    </Grid> */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableCell} style={{ backgroundColor: '#000000', color: '#ffffff' }}>ID</TableCell>
                                <TableCell className={classes.tableCell} align="left" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Usuario</TableCell>
                                <TableCell className={classes.tableCell} align="left" style={{ backgroundColor: '#000000', color: '#ffffff' }}>E-email</TableCell>
                                <TableCell className={classes.tableCell} align="center" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Privilegios</TableCell>
                                <TableCell className={classes.tableCell} align="center" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Eliminar / Bloquear</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.map(user => (
                                <TableRow key={user._id}>
                                    <TableCell className={classes.tableCell} align="left">{user._id}</TableCell>
                                    <TableCell className={classes.tableCell} align="left">{user.name}</TableCell>
                                    <TableCell className={classes.tableCell} align="left">{user.email}</TableCell>
                                    <TableCell className={classes.tableCell} align="center">
                                        {user.isAdmin ?
                                            <Button variant="contained" color="secondary" onClick={() => handlePrivileges(user)}>
                                                Quitar privilegios
                                            </Button>
                                            :
                                            <Button variant="contained" color="primary" onClick={() => handlePrivileges(user)}>
                                                Dar privilegios
                                            </Button>
                                        }
                                    </TableCell>
                                    <TableCell className={classes.tableCell} align="center">
                                        <Button variant="contained" className={classes.button} style={{marginRight:'0.5vh'}} onClick={() => handleDelete(user._id)}>
                                            Eliminar
                                        </Button>

                                        {user?.sub[0] === 'g'?
                                        <Button variant="contained" className={classes.button} onClick={() => handleBlock(user.sub)}>
                                            Bloquear
                                        </Button>
                                        :
                                        <Button variant="contained" color="primary" onClick={() => handleDesblock(user.sub)}>
                                            Desbloquear
                                        </Button>
                                        }
                                        {/* <Modal
                                        open={openModal}
                                        onClose={handleCloseModal}
                                        aria-labelledby="title"
                                        aria-describedby="description"
                                        className={classes.modal}
                                        >
                                        <div className={classes.paper}>
                                            <h2 id="title" style={{display:'flex', justifyContent:'center'}}>¡ATENCIÓN!</h2>
                                            <p id="description">¿Seguro que deseas eliminar este usuario?</p>
                                            <Grid container justifyContent="center">
                                                <Button variant="contained" color="primary" style={{marginRight:'1vh'}} onClick={() => handleDelete(user._id)}>Confirmar</Button>
                                                <Button variant="contained" className={classes.button} style={{marginLeft:'1vh'}} onClick={handleCloseModal}>Cancelar</Button>
                                            </Grid>
                                        </div>
                                    </Modal> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success" variant="filled">
                                    Usuario eliminado exitosamente!
                                </Alert>
                            </Snackbar>
                        </TableBody>
                    </Table>
                </Container>
            </Grid>
        </>
    )
}