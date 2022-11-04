import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginRedux";
import adminloginReducer from "./adminloginRedux";


const store = configureStore({
  reducer:{
    login:loginReducer,
    adminlogin:adminloginReducer,
  }
})

export default store;
