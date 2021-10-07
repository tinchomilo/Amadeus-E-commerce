import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import {
  Typography,
  Container,
  CardMedia,
  makeStyles,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { numberWithCommas } from "../../utils";
import NavSecondary from "./../navsecondary/NavSecondary";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "3vh",
    display: "flex",
    justifyContent: "space-around",
    border: "1px solid black",
  },
  media: {
    width: "10%",
    height: '10vh',
    margin: "0vh",
    backgroundSize: "contain",
  },
  tableCell: {
    padding: "1vw",
   
  },
  img: {   
    backgroundSize: "contain",
  },
}));

export default function ShoppingHistory() {
  const classes = useStyles();
  const userRedux = useSelector((state) => state.app.user);

  const [userDb, setUserDb] = useState();

  console.log(userDb)

  const getUserById = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER}/users/${userRedux._id}`
      );
      setUserDb(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserById(userRedux?._id);
  }, [userRedux]);

  return (
    <>
      <NavSecondary />
      <Grid container style={{ marginTop: "15vh"}} sm={12}>

        <Table style={{width:'80%', margin:'auto' }}>
          <TableHead>
            <TableRow>
             
              <TableCell className={classes.tableCell}> Productos </TableCell>
              <TableCell className={classes.tableCell}> Total Compra </TableCell>
              <TableCell className={classes.tableCell}> Estado </TableCell>
              <TableCell className={classes.tableCell}> Ubicacion </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userDb &&
              userDb.orders.map((order) => (
                <TableRow>
                  
                  <TableCell className={classes.tableCell}>
                    {order.products &&
                      order.products.map((product) => (
                          <Container style ={{width:'10vh'}}>
                          <CardMedia
                            image={product.image}
                            className={classes.img}
                            />
                          {/* <Typography>
                            ${numberWithCommas(product.price)}
                          </Typography> */}
                          </Container>
                      ))}
                  </TableCell>

                  <TableCell>
                    {" "}
                    $
                    {numberWithCommas(
                      order.products.reduce((acc, item) => {
                        return (acc += item.price);
                      }, 0)
                    )}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {order.status === "approved" &&
                      order.status.toUpperCase()}{" "}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Grid>
    </>
  );
}
