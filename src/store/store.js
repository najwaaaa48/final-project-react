import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./reducer/themeReducer";


const store = configureStore({
  reducer :{
    theme :themeReducer,
  }
})

export default store