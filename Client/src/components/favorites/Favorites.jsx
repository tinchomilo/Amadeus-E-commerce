import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  sortByNameFavorites,
  sortByPriceFavorites,
  filterByCategoryFavorites,
} from "../../redux/actions/favorites";
// import { getAllCategories } from "../../redux/actions/getAllCategories";
import {
  getAllFavorites,
  removeAllFavorites,
} from "../../redux/actions/favorites";
import Nav from "../nav/Nav";
import ProductCard from "../productcard/ProductCard";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginTop: "-8vh",
    minWidth: 100,
  },
  label: {
    fontSize: "12px",
  },
  gridContainer: {
    margin: "auto",
    maxWidth: "200vh",
  },
  root: {
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
}));

export default function Favorites() {
  const { user } = useAuth0();
  const dispatch = useDispatch();
  // const categories = useSelector(({ app }) => app.categoriesLoaded);
  const favorites = useSelector(({ app }) => app.favorites);
  const currentUser = useSelector(({ app }) => app.user);

  const classes = useStyles();

  // Para renderizar cuando hay ordenamientos y filtrado
  const [render, setRender] = useState("");
  // Controlador de los select's
  const [select, setSelect] = useState({
    name: "",
    price: "",
    // filter: ""
  });

  // Control del paginado
  const [page, setPage] = useState(1);
  const [favoritesPerPage, setFavoritesPerPage] = useState(12);
  const indexLastFavorite = page * favoritesPerPage;
  const indexFirstFavorite = indexLastFavorite - favoritesPerPage;
  const currentFavorites = favorites.slice(
    indexFirstFavorite,
    indexLastFavorite
  );

  function handleSortName(e) {
    dispatch(sortByNameFavorites(e.target.value));
    setRender(`Sort ${e.target.value}`);
    setSelect({
      ...select,
      name: e.target.value,
    });
    setPage(1);
  }

  function handleSortPrice(e) {
    dispatch(sortByPriceFavorites(e.target.value));
    setRender(`Sort ${e.target.value}`);
    setSelect({
      ...select,
      price: e.target.value,
    });
    setPage(1);
  }

  // function handleFilterCategory(e) {
  //     dispatch(filterByCategoryFavorites());
  //     setRender(`Filter ${e.target.value}`);
  //     setSelect({
  //         ...select,
  //         filter: e.target.value,
  //     });
  //     setPage(1);
  // }

  function handleChange(event, value) {
    setPage(value);
  }

  return (
    <>
      <Nav />
      {user ? (
        <>
          {Array.isArray(favorites) && favorites?.length > 0 ? (
            <>
              <Grid container direction="row" justifyContent="center">
                <Typography
                  variant="h6"
                  style={{ marginTop: "3vh", marginBottom: "3vh" }}
                >
                  Mis Favoritos!
                </Typography>
              </Grid>

              <Grid
                container
                direction="row"
                justifyContent="center"
                style={{ marginTop: "5vh" }}
              >
                {/* <FormControl className={classes.formControl}>
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
                                </FormControl> */}

                <FormControl className={classes.formControl}>
                  <InputLabel className={classes.label}>
                    Nombre
                  </InputLabel>
                  <Select
                    value={select.name}
                    onChange={(e) => handleSortName(e)}
                  >
                    <MenuItem value="A - Z">A - Z</MenuItem>
                    <MenuItem value="Z - A">Z - A</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel className={classes.label}>
                    Precio
                  </InputLabel>
                  <Select
                    value={select.price}
                    onChange={(e) => handleSortPrice(e)}
                  >
                    <MenuItem value="Lower to Higher">Menor a Mayor</MenuItem>
                    <MenuItem value="Higher to Lower">Mayor a Menor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.gridContainer}
              >
                {currentFavorites?.map((favorite) => {
                  return (
                    <ProductCard
                      key={favorite._id}
                      id={favorite._id}
                      name={favorite.name}
                      image={`${REACT_APP_SERVER}/products/images/${favorite.image}`}
                      price={favorite.price}
                      stock={favorite.stock}
                    />
                  );
                })}
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                className={classes.root}
              >
                <Pagination
                  count={Math.ceil(favorites.length / favoritesPerPage)}
                  page={page}
                  onChange={handleChange}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                  style={{ marginBottom: "2vw ", marginTop: "1vw" }}
                />
              </Grid>
            </>
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="center"
              lignItems="center"
            >
              <Typography variant="h6">No tenés Favoritos!</Typography>
            </Grid>
          )}
        </>
      ) : (
        <Grid
          container
          direction="row"
          justifyContent="center"
          lignItems="center"
        >
          <Typography variant="h6">No estás logueado!</Typography>
        </Grid>
      )}
    </>
  );
}
