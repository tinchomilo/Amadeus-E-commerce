import {
  GET_ALL_PRODUCTS,
  GET_DETAILS,
  SORT_BY_NAME,
  SORT_BY_PRICE,
  FILTER_BY_CATEGORY,
  ADD_CATEGORY,
  SET_SEARCHBAR,
  GET_ALL_CATEGORIES,
  GET_ALL_REVIEWS,
  REMOVE_ALL_REVIEWS,
  GET_ALL_FAVORITES,
  ADD_FAVORITE,
  DELETE_FAVORITE,
  REMOVE_ALL_FAVORITES,
  SORT_BY_PRICE_FAVORITES,
  SORT_BY_NAME_FAVORITES,
  FILTER_BY_CATEGORY_FAVORITES,
  ADD_USER,
  GET_ALL_USERS,
  ADD_ORDER_ID,
  SAVE_USER,
  CLEAN_USER,
  CLEAN_USER_CART,
  CLEAR_APP

} from "../actions/index";

const initialState = {
  productsLoaded: {
    data: [],
    success: undefined,
    error: undefined,
    loading: false,
  },
  allProducts: {
    data: [],
    success: undefined,
    error: undefined,
    loading: false,
  }, //para el filtrado
  searchBar: "",
  categoriesLoaded: [],
  detail: {
    data: {},
    success: undefined,
    error: undefined,
    loading: false,
  },
  usersLoaded: [],
  order: "",
  reviewsLoaded: [],
  favorites: [],
  // allFavorites:[],
  user: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        productsLoaded: action.payload,
        allProducts: action.payload, //para el filtrado
      };

    case GET_DETAILS:
      return {
        ...state,
        detail: action.payload,
      };

    case SORT_BY_NAME:
      let sortName = {
        data:
          action.payload.data === "A - Z"
            ? state.productsLoaded.data.sort((a, b) => {
              if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
              }
              if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1;
              }
              return 0;
            })
            : state.productsLoaded.data.sort((a, b) => {
              if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return -1;
              }
              if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return 1;
              }
              return 0;
            }),
        success: true,
        error: false,
        loading: false,
      };
      return {
        ...state,
        productsLoaded: sortName,
      };
    case SORT_BY_PRICE:
      let sortPrice = {
        data:
          action.payload.data === "Lower to Higher"
            ? state.productsLoaded.data.sort((a, b) => {
              return a.price - b.price;
            })
            : state.productsLoaded.data.sort((a, b) => {
              return b.price - a.price;
            }),
        success: true,
        error: false,
        loading: false,
      };
      return {
        ...state,
        productsLoaded: sortPrice,
      };

    case FILTER_BY_CATEGORY:
      let allProducts = state.allProducts;
      let filterCategory = {
        data: [],
        success: undefined,
        error: undefined,
        loading: true,
      };
      if (action.payload.data === "All") {
        filterCategory = {
          data: allProducts.data,
          success: true,
          error: false,
          loading: false,
        };
      } else {
        allProducts.data.forEach((product) => {
          product.categories.forEach((p) => {
            if (p.name === action.payload.data) {
              filterCategory.data.push(product);
            }
          });
          filterCategory.success = true;
          filterCategory.error = false;
          filterCategory.loading = false;
        });
      }
      return {
        ...state,
        productsLoaded: filterCategory,
      };

    case GET_ALL_CATEGORIES:
      return {
        ...state,
        categoriesLoaded: action.payload,
      };

    case ADD_CATEGORY:
      return state;
    case SET_SEARCHBAR:
      return {
        ...state,
        searchBar: action.payload,
      };
    case ADD_USER:
      return state;

    case ADD_ORDER_ID:
      return {
        ...state,
        order: action.payload,
      };
    case GET_ALL_USERS:
      return {
        ...state,
        usersLoaded: action.payload,
      };

    case GET_ALL_REVIEWS:
      return {
        ...state,
        reviewsLoaded: action.payload,
      };

    case REMOVE_ALL_REVIEWS:
      return {
        ...state,
        reviewsLoaded: [],
      }

    case GET_ALL_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
        allFavorites: action.payload
      }

    case ADD_FAVORITE:
      return state;

    case DELETE_FAVORITE:
      return state;

    case REMOVE_ALL_FAVORITES:
      return {
        ...state,
        favorites: [],
      }

    case SORT_BY_PRICE_FAVORITES:
      let sortPriceFavorites = action.payload === "Lower to Higher" ?
        state.favorites.sort((a, b) => {
          return a.price - b.price;
        })
        : state.favorites.sort((a, b) => {
          return b.price - a.price;
        });
      return {
        ...state,
        favorites: sortPriceFavorites
      };

    case SORT_BY_NAME_FAVORITES:
      let sortNameFavorites = action.payload === "A - Z" ?
        state.favorites.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          return 0;
        })
        : state.favorites.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
      return {
        ...state,
        favorites: sortNameFavorites
      };

    // case FILTER_BY_CATEGORY_FAVORITES:
    //   let allFavorites = state.allFavorites;
    //   var filterCategoryFavorites = [];
    //   if(action.payload === "All"){
    //     filterCategoryFavorites = allFavorites
    //   } else {
    //     allFavorites.forEach((favorite) => {
    //       favorite.categories.forEach((c) => {
    //         if (c.name === action.payload) {
    //           filterCategoryFavorites.push(favorite);
    //         }
    //       });
    //     });
    //   };
    //   return {
    //     ...state,
    //     favorites: filterCategoryFavorites
    //   };

    case SAVE_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAN_USER:
      return {
        ...state,
        user: null,
      };
    case CLEAN_USER_CART:
      return {
        ...state,
        user: {...state.user, cart:[]},
      };
    case CLEAR_APP:
      return initialState

    default:
      return state;
  }
};

export default appReducer;
