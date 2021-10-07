import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Container, Paper, Typography, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    textField: {
        marginBottom: '2vh',
        minWidth: '24vw',
    },
    buttom: {
        margin: '1vh',
    },
}))

export default function Login(){

    const classes = useStyles();

    const [error, setError] = useState({});
    const [input, setInput] = useState({
        email:'',
        password:'',
        showPassword: false,
    })

    function handleVisibilityPassword(){
        setInput({
            ...input,
            showPassword: !input.showPassword
        })
    }

    function handleInput(e){
        // setError(validate({
        //     ...input,
        //     [e.target.name]: e.target.value
        // }))
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Grid container component="main">
            <Container component={Paper} elevation={24} style={{ padding: '2vh', maxWidth: '26vw' }}>

                <Typography align='center' variant='h6' color='primary' style={{ marginBottom: '1vh' }}>
                    Inicia sesión
                </Typography>

                <TextField
                    className={classes.textField}
                    required
                    name="email"
                    value={input.email}
                    label="E-mail"
                    variant="outlined"
                    onChange={handleInput}
                    helperText={error.email}
                />

                <FormControl variant="outlined">
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
                    <FormHelperText id="contraseña"> {/*className={classes.formHelper}*/} {error.password}</FormHelperText>
                </FormControl>
                
                <Grid container direction="row" justifyContent="center" >
                    <Button variant="contained" color="primary" className={classes.buttom}>
                        Entrar
                    </Button>
                </Grid>

            </Container>
        </Grid>
    )
}