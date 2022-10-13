import { createSlice } from "@reduxjs/toolkit";

const initialLoginState = {
  login:false,
}

const loginSlice = createSlice({
  name:'login',
  initialState:initialLoginState,
  reducers:{
    loggedin(state){
      state.login = true;
    },
    loggedout(state){
      state.login = false;
    },
  }
})

export const {loggedin} = loginSlice.actions;
export const {loggedout} = loginSlice.actions;
export default loginSlice.reducer;