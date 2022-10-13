import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginRedux";


const store = configureStore({
  reducer:{
    login:loginReducer,
  }
})

export default store;
