import React from "react";
import Footer from "../footer/Footer";
import ProductDetail from "../productdetail/ProductDetail";
import { makeStyles } from "@material-ui/core/styles";
import Nav from "../nav/Nav";

const useStyles = makeStyles((theme) => ({
  home: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

export default function Detail() {
  const classes = useStyles();
  return (
    <div className={classes.home}>
      <Nav />
      <ProductDetail />
      <Footer />
    </div>
  );
}
