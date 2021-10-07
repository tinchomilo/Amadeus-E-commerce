import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, styled } from '@material-ui/styles';
import { FormHelperText, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Typography, Container, Paper, Grid, TextField, Button, Snackbar, Avatar } from '@material-ui/core';
import { Visibility, VisibilityOff, Check, Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import NavSecondary from "../navsecondary/NavSecondary";
import axios from 'axios';
import { headers } from "../../utils/GetHeaders";
const { REACT_APP_SERVER } = process.env

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        marginTop:'1vh',
        // height:'100%',
        // alignItems:"center",
    },
    textField: {
        marginBottom: '2vh',
        minWidth:'24vw',
        // justifyContent:"center",
    },
    formHelper:{
        marginTop: '-1.5vh',
    },
    buttom: {
        backgroundColor: '#8e0000',
        color: '#ffffff',
        margin:'1vh',
    },
}))

const Input = styled('input')({
    display: 'none',
});

export default function EditUserInfo(){

    const classes = useStyles();

    const history = useHistory();
    const dispatch = useDispatch();
    const currentUser = useSelector(({app}) => app.user);
    const users = useSelector(({app}) => app.usersLoaded);
    // const [user, setUser] = useState({});
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [error, setError] = useState({});
    const [image, setImage] = useState(null);
    const [input, setInput] = useState({
        name:'',
        nickname:'',
        phone:'',
        picture: ''
    })

    let data = {};

    async function getUser(){
        let response = await axios.get(`${REACT_APP_SERVER}/users/${currentUser._id}`, { headers });
        data = response.data;
        setInput({
            name: data.name,
            nickname: data.nickname,
            phone: data.phone,
            picture: data.picture
        })  
    }

    useEffect(() => {
        getUser();
    },[])

    const handleUpload = async (file) => {
        const formData = new FormData();
        if (file) {
            formData.append("file", file, `asd.${file?.type.replace(/(.*)\//g, "")}`);
            const image = await axios.post(
                `${REACT_APP_SERVER}/users/images`,
                formData
            );
            console.log('image.data ', image.data)
            setInput({
                ...input,
                picture: `${REACT_APP_SERVER}/users/images/${image.data}`,
            });
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setOpenSuccess(false);
        setOpenError(false);
    };

    // function validateEmail(email){
    //     return users.some(user => {
    //         return user.email === email;
    //     })
    // }

    function validate(input){
        let error = {};

        if(!input.name){
            error.name = 'Debe ingresar su nombre y apellido'
        } else if(!/^[a-zA-Z ,.'-]+$/u.test(input.name)){
            error.name = 'El nombre no es válido'
        } else if(input.name.length < 8){
            error.name = 'El nombre completo debe tener un minimo de 8 letras'
        }

        if(!input.nickname){
            error.nickname = 'Debe ingresar su nickname'
        } else if(!/^[a-zA-Z0-9 ,.'-]+$/u.test(input.nickname)){
            error.nickname = 'El nickname no es válido'
        } else if(input.nickname.length < 4){
            error.nickname = 'El nickname debe tener un minimo de 4 letras'
        }

        // if(!input.surname){
        //     error.surname = 'Debe ingresar su apellido'
        // } else if(!/^[a-zA-Z ,.'-]+$/u.test(input.surname)){
        //     error.surname = 'El apellido no es válido'
        // } else if(input.surname.length < 3){
        //     error.surname = 'El apellido debe tener un minimo de 3 letras'
        // }

        // if(!input.document){
        //     error.document = 'Debe ingresar su número de documento'
        // } else if(!/^[0-9]+$/u.test(input.document)){
        //     error.document = 'Solo ingrese números'
        // } else if(input.document.length !== 8){
        //     error.document = 'El documento debe tener 8 números'
        // } else if(){
            // error.document = 'Ya hay un usuario registrado con ese número de documento'
        //}

        // if(!input.email){
        //     error.email = 'Debe ingresar su email'
        // } else if(!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(input.email)){
        //     error.email = 'El email no es válido'
        // }  else if(validateEmail(input.email)){
        //     error.email = 'El email ya esta registrado'
        // }
        
        // if(!input.password){
        //     error.password = 'Debe ingresar su contraseña'
        // } else if(!/^[a-zA-Z0-9.-_()]+$/u.test(input.password)){
        //     error.password = 'Solo ingrese caracteres válidos'
        // } else if(input.password.length < 8 || input.password.length > 16){
        //     error.password = 'La contraseña debe tener entre 8 y 16 caracteres'
        // }

        if(input.phone){
            if(!/^[0-9+]+$/u.test(input.phone)){
                error.phone = 'Formato no válido'
            } else if(input.phone.length > 13){
                error.phone = 'El número debe tener como maximo de 13 digitos'
            }
        }
        return error;
        
    }

    function handleInput(e){
        setError(validate({
            ...input,
            [e.target.name]: e.target.value
        }))
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log(image);
        data = {
            ...data,
            name: input.name,
            nickname: input.nickname,
            phone: input.phone,
            picture: input.picture
        };
        axios.put(`${REACT_APP_SERVER}/users/${currentUser._id}`, data, { headers })
        setInput({
            name:'',
            nickname:'',
            phone:'',
            picture:''
        });
        setOpenSuccess(true);
        // setOpenError(true);
        history.push('/userprofile');
    }

    function handleClick(e){
        setInput({
            name:'',
            nickname:'',
            phone:'',
            picture:''
        });
        history.push('/userprofile');
    }

    // function handleVisibilityPassword(){
    //     setInput({
    //         ...input,
    //         showPassword: !input.showPassword
    //     })
    // }

    return (
        <>
        <NavSecondary />
    <Grid container component="main" direction="row" className={classes.gridContainer}>
        <Container component={Paper} elevation={24} style={{ padding: '2vh', maxWidth: '26vw' }}>
            <Typography align='center' variant='h6' color='primary' style={{ marginBottom: '1vh' }}>Editar info básica</Typography>
            <form onSubmit={handleSubmit}>

                <TextField
                    className={classes.textField}
                    required
                    name="name"
                    value={input.name}
                    label="Nombre y Apellido"
                    variant="outlined"
                    onChange={handleInput}
                    helperText={error.name}
                />

                    <TextField
                        className={classes.textField}
                        required
                        name="nickname"
                        value={input.nickname}
                        label="Nickname"
                        variant="outlined"
                        onChange={handleInput}
                        helperText={error.nickname}
                    />

                        <TextField
                            className={classes.textField}
                            name="phone"
                            value={input.phone}
                            label="N° de teléfono"
                            variant="outlined"
                            onChange={handleInput}
                            helperText={error.phone}
                        />
                    
                    {/* <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" type="file" onChange={handleUpload}/>
                            <Button variant="contained" component="span">
                                Cambiar foto
                            </Button>
                        </label> */}


                {/* <TextField
                    className={classes.textField}
                    required
                    name="surname"
                    value={input.surname}
                    label="Apellido/s"
                    variant="outlined"
                    onChange={handleInput}
                    helperText={error.surname}
                /> */}

                {/* <TextField
                    className={classes.textField}
                    required
                    name="document"
                    value={input.document}
                    label="N° de documento"
                    variant="outlined"
                    onChange={handleInput}
                    helperText={error.document}
                /> */}

                {/* <TextField
                    className={classes.textField}
                    required
                    name="email"
                    value={input.email}
                    label="E-mail"
                    variant="outlined"
                    onChange={handleInput}
                    helperText={error.email}
                /> */}

                {/* <FormControl variant="outlined">
                    <InputLabel htmlFor="contraseña">Contraseña *</InputLabel>
                    <OutlinedInput
                        id="contraseña"
                        className={classes.textField}
                        required
                        name="password"
                        value={input.password}
                        label="contraseña *"
                        type={input.showPassword ? "text" : "password"}
                        onChange={handleInput}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton edge="end" onClick={handleVisibilityPassword}>
                                    {input.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText id="contraseña" className={classes.formHelper}>{error.password}</FormHelperText>
                </FormControl> */}

                <Grid container direction="row" justifyContent="center" alignItems="center">
                    {!error.name && !error.nickname && !error.phone &&
                        <Button type="submit" variant="contained" color="primary" endIcon={<Check />}>
                            Editar
                        </Button>
                    }

                    <Snackbar open={openSuccess} autoHideDuration={5000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" variant="filled">
                            Datos modificados exitosamente!
                        </Alert>
                    </Snackbar>
                    <Snackbar open={openError} autoHideDuration={5000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" variant="filled">
                            Hubo un error al enviar los datos!
                        </Alert>
                    </Snackbar>

                    <Button className={classes.buttom} variant="contained" endIcon={<Close />} onClick={handleClick}>Volver</Button>
                </Grid>
            </form>
        </Container>
    </Grid>
    </>
    )
}
