import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import getAllProducts, {
  filterByCategory,
  sortByName,
  sortByPrice,
} from "../../redux/actions/getAllProducts";
import { numberWithCommas } from "../../utils";
import axios from "axios";
import NavSecondary from "../navsecondary/NavSecondary";
import { Pagination } from "@material-ui/lab";
import ClearIcon from "@material-ui/icons/Clear";
import { getAllCategories } from "../../redux/actions/getAllCategories";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 1000,
    height: 240,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 10px 40px 0px rgba(0,117,49,0.3)",
    },
    margin: "3vh",
  },
  media: {
    width: "100%",
    height: "100%",
    minHeight: 220,
    minWidth: 240,
    margin: "0vh",
    backgroundSize: "contain",
  },

  price: {
    color: theme.palette.primary.dark,
    fontSize: "24px",
  },
  icon: {
    color: "grey",
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  text: {
    textDecoration: "none",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    width: "16vh",
    fontSize: "1.6vh",
  },
  description: {
    overflow: "auto",
  },
  formControl: {
    margin: theme.spacing(1),
    marginTop: "-8vh",
    minWidth: 130,
  },
  label: {
    fontSize: "12px",
  },
  page: {
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
  clearButton: {
    marginTop: "-6vh",
  },
}));

function Stock() {
  const { data, loading, success } = useSelector(
    ({ app }) => app.productsLoaded
  );
  const categories = useSelector(({ app }) => app.categoriesLoaded);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { REACT_APP_SERVER } = process.env;

  const [select, setSelect] = useState({
    name: "",
    price: "",
    filter: "",
  });
  const [page, setPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const indexLastProduct = page * productsPerPage;
  const indexFirstProduct = indexLastProduct - productsPerPage;
  const currentProducts = data.slice(indexFirstProduct, indexLastProduct);

  function handleSortName(e) {
    dispatch(sortByName(e.target.value));
    setSelect({
      ...select,
      name: e.target.value,
    });
    setPage(1);
  }

  function handleSortPrice(e) {
    dispatch(sortByPrice(e.target.value));
    setSelect({
      ...select,
      price: e.target.value,
    });
    setPage(1);
  }

  function handleFilterCategory(e) {
    setSelect({
      ...select,
      filter: e.target.value,
    });
    setPage(1);
  }

  function handleChange(event, value) {
    setPage(value);
  }

  useEffect(() => {
    dispatch(filterByCategory(select.filter));
  }, [select.filter]);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleDelete = (id) => {
    axios.delete(`${REACT_APP_SERVER}/products/${id}`);
  };

  const clearFilters = () => {
    setSelect({});
    dispatch(getAllProducts());
  };

  return (
    <>
      <NavSecondary />
      <div style={{ display: "contents", marginTop: "10vh" }}>
        {loading && (
          <div style={{ display: "contents" }}>
            <div></div>
            <div className="loading">
              <CircularProgress />
            </div>
          </div>
        )}
        {!loading && success && (
          <div style={{ marginTop: "13vh" }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              style={{ marginTop: "5vh" }}
            >
              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label}>
                  Filtrar por Categoria
                </InputLabel>
                <Select
                  value={select.filter}
                  onChange={(e) => handleFilterCategory(e)}
                >
                  <MenuItem value="All">Todos</MenuItem>
                  {categories?.map((category, index) => (
                    <MenuItem key={index} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label}>
                  Ordenar por Nombre
                </InputLabel>
                <Select value={select.name} onChange={(e) => handleSortName(e)}>
                  <MenuItem value="A - Z">A - Z</MenuItem>
                  <MenuItem value="Z - A">Z - A</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label}>
                  Ordenar por Precio
                </InputLabel>
                <Select
                  value={select.price}
                  onChange={(e) => handleSortPrice(e)}
                >
                  <MenuItem value="Lower to Higher">Lower to Higher</MenuItem>
                  <MenuItem value="Higher to Lower">Higher to Lower</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.clearButton}>
                <Button onClick={clearFilters}>
                  <ClearIcon />
                </Button>
              </FormControl>
            </Grid>
            {currentProducts.map((product) => {
              return (
                <Grid container justifyContent="center">
                  <Card className={classes.root}>
                    <div style={{ display: "flex" }}>
                      <div style={{ height: "220px", width: "240px" }}>
                        <CardMedia
                          className={classes.media}
                          image={`${REACT_APP_SERVER}/products/images/${product.image}`}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CardContent>
                          <Typography variant="h5" component="h1">
                            {product.name}
                          </Typography>
                          <Typography component="h1" className={classes.price}>
                            $ {numberWithCommas(product.price)}
                          </Typography>
                          {/* <Typography className={classes.description} variant="body2" component="h3">
                          {product.description}
                        </Typography> */}
                          {product.stock === 0 ? (
                            <Typography
                              variant="body2"
                              color="error"
                              component="p"
                            >
                              Sin stock
                            </Typography>
                          ) : (
                            <Typography variant="body2" component="p">
                              Cantidad: {product.stock} unidades
                            </Typography>
                          )}
                        </CardContent>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <CardActions
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            flexDirection: "column",
                            margin: "0",
                          }}
                        >
                          <Link
                            to={`/editproduct/${product._id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="contained"
                              className={classes.button}
                            >
                              Editar
                            </Button>
                          </Link>
                          <form
                            onSubmit={() => handleDelete(product._id)}
                            style={{ display: "flex", margin: "0" }}
                          >
                            <Button
                              variant="contained"
                              className={classes.button}
                              type="submit"
                            >
                              Eliminar
                            </Button>
                          </form>
                        </CardActions>
                      </div>
                    </div>
                  </Card>
                </Grid>
              );
            })}
            <Grid
              container
              direction="row"
              justifyContent="center"
              className={classes.page}
            >
              <Pagination
                count={Math.ceil(data.length / productsPerPage)}
                page={page}
                onChange={handleChange}
                variant="outlined"
                shape="rounded"
                color="primary"
                style={{ marginBottom: "2vw ", marginTop: "1vw" }}
              />
            </Grid>
          </div>
        )}
      </div>
    </>
  );
}

export default Stock;
