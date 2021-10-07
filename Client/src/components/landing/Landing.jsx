import React from "react";
import { Link } from "react-router-dom";
import './landing.css'
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import videoHenry1 from './media/videoHenry1.mp4'
import fotoHenry from './media/fotoHenry.png'

const useStyles = makeStyles((theme) => ({
  logo: {
    // // marginTop: "2vh",
    // height: "95%",
    // width: "25vh",
    // backgroundSize: "contain",
    // // margin: "auto",
    // // borderRadius: "6px",
    fontFamily: "Abadi MT Condensed Light",/*  "Garamond",  */
    fontSize: "40px",
    color: "white"
  },
}))

export default function LandingPage() {
  const classes = useStyles();
  return (
    <div className='Ini'>
        <video className="video" src={videoHenry1} autoPlay loop muted /* controls */ poster={fotoHenry} />
      <Link to="/" style={{ margin: '1vh', textDecoration: "none" }}>
          {<Typography className={classes.logo}>Bienvenido a AmadeuS</Typography>}
      </Link>
      <Link to="/" style={{ margin: '1vh', textDecoration: "none" }}>
          {<Typography className={classes.logo}>Tienda Musical</Typography>}
      </Link>
      <div className='IniEntrar'>
      <Link to="/" style={{ margin: '1vh', textDecoration: "none" }}>
          {<Typography className={classes.logo}>ENTRAR </Typography>}
      </Link>
      </div>
    </div>
  );
}
