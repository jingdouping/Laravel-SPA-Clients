import "./bootstrap";
import React, { useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./clients/pages/Home";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./clients/redux/store";
import './app.scss';
import Product from "./clients/pages/Product";
import ProductList from "./clients/pages/ProductList";
import NoPage from "./clients/pages/NoPage";
import Login from "./clients/pages/Login";
import Register from "./clients/pages/Register";
import Cart from "./clients/pages/Cart";
import Swal from "sweetalert2";
import { loggedin,loggedout } from './clients/redux/loginRedux'
import Checkout from "./clients/pages/CheckOut";
import PasswordReset from "./clients/pages/PasswordReset";
import ResetPassword from "./clients/pages/ResetPassword";

axios.defaults.baseURL = 'http://127.0.0.1:8000/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


export const loginaxios = axios.create({
  withCredentials:true,
  baseURL:'http://127.0.0.1:8000/',
  headers:{
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type':'application/json',
    'Accept':'application/json',
  },
})

export const tologinaxios = axios.create({
  withCredentials:true,
  baseURL:'http://127.0.0.1:8000/',
  headers:{
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type':'application/json',
    'Accept':'application/json',
  },
})

function App() {
    const isLoggedIn = useSelector(state=>state.login.login)
    const dispatch = useDispatch();

    useEffect(()=>{
        if(localStorage.getItem('loggedin')){
            dispatch(loggedin());
        }else if(!localStorage.getItem('loggedin')){
            dispatch(loggedout());
        }
    },[])


    loginaxios.interceptors.response.use(
        function(response){
            return response;
        },
        function(error){
            if(error.response.status === 419){
                Swal.fire({
                    title: 'Error',
                    text:'セッションが切れました。もう一度ログインしてください',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                localStorage.removeItem('loggedin');
                dispatch(loggedout());
            }else if(error.response.status === 429){
                Swal.fire({
                    title: 'Error',
                    text:'申し訳ございません、アクセスが多すぎます。時間をおいてもう一度お願いします。',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }else if(error.response.status === 401){
                Swal.fire({
                    title: 'Error',
                    text:'セッションが切れました。もう一度ログインしてください',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                localStorage.removeItem('loggedin');
                dispatch(loggedout());
            }
        }
    )

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/login' element={isLoggedIn === true ? <Home/> : <Login/>}/>
                <Route path='/register' element={isLoggedIn === true ? <Home/> : <Register/>}/>
                <Route path='/api/reset-password/:token' element={isLoggedIn === true ? <Home/> :<ResetPassword/>}/>
                <Route path='/passwordreset' element={isLoggedIn === true ? <Home/> : <PasswordReset/>}/>
                <Route path='/cart' element={isLoggedIn === true ? <Cart/> : <Home/>}/>
                <Route path='/checkout' element={isLoggedIn === true ? <Checkout/> : <Home/>}/>
                <Route path='/products/:cat_id' element={<ProductList/>}/>
                <Route path='/product/:product_code/:onlyid' element={<Product/>}/>
                <Route path='*' element={<NoPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
