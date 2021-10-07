import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import {
  Input,
  Checkbox,
  ListItemText,
  FormHelperText,
  Button,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  Grid,
  CardMedia,
  Divider,
  Box,
  OutlinedInput,
  Modal,
  Fade,
  Backdrop,
  CssBaseline,
  Fab,
} from "@material-ui/core";
import { getAllCategories } from "../../redux/actions/getAllCategories";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDetails } from "../../redux/actions/getDetails";
import { useParams } from "react-router";
import { numberWithCommas } from "../../utils";
import NavSecondary from "./../navsecondary/NavSecondary";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
const { REACT_APP_SERVER } = process.env;

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "60vh",
    height: "80%",
    margin: "2%",
    padding: "3vh",
    border: `3px solid ${theme.palette.primary.dark}`,
    borderRadius: "2vh",
  },
  btnBack: {
    backgroundColor: "#16222A",
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    width: "29.5vh",
  },
  btnPublicar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    marginTop: "10vh",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.contrastText,
  },
  field: {
    marginTop: "1vh",
    marginBottom: "1vh",
    height: "8vh",
  },
  text: {
    color: theme.palette.primary.dark,
  },
  media: {
    width: "100%",
    paddingTop: "80%", // 16:9
    margin: "0vh",
    backgroundSize: "contain",
    "&:hover": {
      backgroundSize: "larger",
    },
  },
  container: {
    width: "80vh",
    margin: "5vh",
  },
  mp: {
    maxWidth: "8vh",
    marginRight: "5vh",
    marginLeft: "5vh",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    width: "18vh",
    fontSize: "2vh",
    marginRight: "4vh",
    marginLeft: "4vh",
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  msg: {
    fontStyle: "italic",
  },
  uploadInput: {
    display: "none",
  },
  uploadButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    marginTop: "1vh",
  },
  descError: {
    marginTop: "10vh",
  },
}));

function AddProduct() {
  const classes = useStyles();
  const [val, setVal] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const initialInput = {
    name: "",
    price: "",
    description: "",
    brand: "",
    stock: "",
    categories: [],
    image: "",
  };
  const [input, setInput] = useState(initialInput);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  // const { data, loading, success } = useSelector(({ app }) => app.detail);
  const categories = useSelector(({ app }) => app.categoriesLoaded);
  const dispatch = useDispatch();
  const { id } = useParams();

  const getProductById = async () => {
    try {
      const response = await axios.get(`${REACT_APP_SERVER}/products/${id}`);
      setInput(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
    if (id) {
      getProductById(id);
    }
  }, [dispatch]);

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (event) => {
    setVal(event.target.value);
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(input);
      if (input._id) {
        axios.put(`${REACT_APP_SERVER}/products/${input._id}`, input);
        setOpen(true);
      } else {
        axios.post(`${REACT_APP_SERVER}/products`, input);
        setInput(initialInput);
        setOpen(true);
      }
    }
  };

  function validate() {
    let errors = {};
    if (!input.name) {
      errors.name = "Elegí el nombre";
    }
    if (!input.description) {
      errors.description = "Debe tener descripción";
    }
    if (!input.categories || !input.categories.length) {
      errors.categories = "Debes elegir categorías";
    }
    if (!input.price || isNaN(input.price)) {
      errors.price = "Debes seleccionar precio";
    }
    if (input.price < 0) {
      errors.price = "El precio no puede ser negativo";
    }
    if (isNaN(input.stock)) {
      errors.stock = "Debes seleccionar cantidad";
    }
    if (input.stock < 0) {
      errors.stock = "El stock no puede ser negativo";
    }
    if (!input.stock) {
      errors.stock = "Debes seleccionar stock";
    }
    if (!input.brand || !input.brand.length) {
      errors.brand = "Debe tener marca";
    }
    if (!input.image || !input.image.length) {
      errors.image = "Elegí una imagen";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  useEffect(() => {
    validate();
  }, [input]);

  useEffect(() => {
    setErrors({});
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file, `asd.${file?.type.replace(/(.*)\//g, "")}`);
      console.log("file", formData, file);
      const image = await axios.post(
        `${REACT_APP_SERVER}/products/images`,
        formData
      );
      console.log(image.data);
      setInput({
        ...input,
        image: image.data,
      });
    }
  };

  return (
    <>
      <NavSecondary />

      <Grid
        container
        style={{ marginTop: "10vh", marginLeft: "2%", overflowX: "hidden" }}
      >
        <Grid item xs={6}>
          <Typography variant="h5" color="primary">
            Completa los campos para crear producto
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl
              className={classes.formControl}
              onSubmit={handleSubmit}
            >
              <TextField
                className={classes.field}
                inputProps={{ className: classes.text }}
                InputLabelProps={{ className: classes.text }}
                required
                name="name"
                value={input.name}
                label="Producto"
                variant="outlined"
                onChange={handleInputChange}
              />
              {errors.name && (
                <FormHelperText error id="component-error">
                  {errors.name}
                </FormHelperText>
              )}
              <Input
                type="file"
                id="contained-button-file"
                required
                className={classes.uploadInput}
                onChange={(e) => handleUpload(e.target.files[0])}
              />
              <label htmlFor="contained-button-file">
                <Fab component="span" className={classes.uploadButton}>
                  <AddPhotoAlternateIcon />
                </Fab>
              </label>
              {/* <TextField
                className={classes.field}
                required
                inputProps={{ className: classes.text }}
                InputLabelProps={{ className: classes.text }}
                name="image"
                value={input.image}
                label="Imagen URL"
                variant="outlined"
                onChange={handleInputChange}
              />
              */}
              {errors.image && (
                <FormHelperText error id="component-error">
                  {errors.image}
                </FormHelperText>
              )}
              <TextField
                className={classes.field}
                inputProps={{ className: classes.text }}
                InputLabelProps={{ className: classes.text }}
                required
                name="price"
                value={input.price}
                label="Precio"
                variant="outlined"
                type="number"
                onChange={handleInputChange}
              />
              {errors.price && (
                <FormHelperText error id="component-error">
                  {errors.price}
                </FormHelperText>
              )}
              <TextField
                className={classes.field}
                inputProps={{ className: classes.text }}
                InputLabelProps={{ className: classes.text }}
                required
                name="brand"
                value={input.brand}
                label="Marca"
                variant="outlined"
                onChange={handleInputChange}
              />
              {errors.brand && (
                <FormHelperText error id="component-error">
                  {errors.brand}
                </FormHelperText>
              )}
              <TextField
                className={classes.field}
                inputProps={{ className: classes.text }}
                InputLabelProps={{ className: classes.text }}
                required
                name="stock"
                value={input.stock}
                label="Unidades disponibles"
                variant="outlined"
                type="number"
                onChange={handleInputChange}
              />
              {errors.stock && (
                <FormHelperText error id="component-error">
                  {errors.stock}
                </FormHelperText>
              )}
              {input._id ? (
                <FormControl variant="outlined" className={classes.field}>
                  <InputLabel>Categorías</InputLabel>
                  <Select
                    multiple
                    label="Categorías"
                    value={input.categories}
                    name="categories"
                    onChange={handleSelectChange}
                    input={<OutlinedInput label="Categorias" />}
                    renderValue={(selected) =>
                      categories
                        .filter((c) => selected.indexOf(c._id) > -1)
                        .map((c) => c.name)
                        .join(", ")
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.name} value={category._id}>
                        <Checkbox checked={val.indexOf(category._id) > -1} />
                        <ListItemText primary={category.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <FormControl variant="outlined" className={classes.field}>
                  <InputLabel>Categorías</InputLabel>
                  <Select
                    multiple
                    label="Categorías"
                    value={input.categories}
                    name="categories"
                    onChange={handleSelectChange}
                    input={<OutlinedInput label="Categorias" />}
                    renderValue={(selected) =>
                      categories
                        .filter((c) => selected.indexOf(c.name) > -1)
                        .map((c) => c.name)
                        .join(", ")
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.name} value={category.name}>
                        <Checkbox checked={val.indexOf(category.name) > -1} />
                        <ListItemText primary={category.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {errors.categories && (
                <FormHelperText error id="component-error">
                  {errors.categories}
                </FormHelperText>
              )}

              <TextField
                id="standard-multiline-static"
                name="description"
                label="Descripción"
                value={input.description}
                className={classes.field}
                inputProps={{ className: classes.text }}
                InputLabelProps={{ className: classes.text }}
                multiline
                variant="outlined"
                rows={4}
                fullWidth
                onChange={handleInputChange}
              />
              {errors.description && (
                <FormHelperText
                  error
                  id="component-error"
                  className={classes.descError}
                >
                  {errors.description}
                </FormHelperText>
              )}

              <Button type="submit" className={classes.btnPublicar}>
                Publicar
              </Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1vh",
                }}
              >
                <Link to="/" className={classes.link}>
                  <Button variant="contained" className={classes.btnBack}>
                    Home
                  </Button>
                </Link>
                <Link to="/adminpanel" className={classes.link}>
                  <Button variant="contained" className={classes.btnBack}>
                    Volver
                  </Button>
                </Link>
              </div>
            </FormControl>
          </form>
        </Grid>

        <Grid item xs={6} style={{ marginRight: "0%" }}>
          <Grid item xs={6}>
            <CardMedia
              className={classes.media}
              image={`${REACT_APP_SERVER}/products/images/${input.image}`}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              component="h1"
              variant="h4"
              className={classes.container}
            >
              {input.name}
              <Divider variant="middle" light />
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              className={classes.container}
            >
              ${input.price}
              <Divider />
            </Typography>
            <Typography
              component="p"
              variant="body2"
              className={classes.container}
            >
              {input.description}
            </Typography>
            <Grid
              style={{
                width: "600px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box>
                {" "}
                <img
                  src={"https://img.icons8.com/color/480/mercado-pago.png"}
                  className={classes.mp}
                />
              </Box>
              <Button variant="contained" className={classes.button}>
                Add to Cart
              </Button>
              <Button variant="contained" className={classes.button}>
                Buy
              </Button>
            </Grid>
            <Typography
              variant="body2"
              component="h3"
              className={classes.container}
            >
              Stock: {input.stock} {input.brand}
            </Typography>
          </Grid>
        </Grid>

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
              </div>
            </Fade>
          </Modal>
        </div>
      </Grid>
    </>
  );
}

export default AddProduct;
