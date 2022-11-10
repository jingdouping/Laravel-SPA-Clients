import "./bootstrap";
import React, { useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./clients/pages/Home";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import './app.scss';
import Product from "./clients/pages/Product";
import ProductList from "./clients/pages/ProductList";
import NoPage from "./clients/pages/NoPage";
import Login from "./clients/pages/Login";
import Register from "./clients/pages/Register";
import Cart from "./clients/pages/Cart";
import Swal from "sweetalert2";
import { loggedin,loggedout } from './redux/loginRedux'
import { adminloggedin,adminloggedout } from './redux/adminloginRedux'
import Checkout from "./clients/pages/CheckOut";
import PasswordReset from "./clients/pages/PasswordReset";
import ResetPassword from "./clients/pages/ResetPassword";
import List from './admin/pages/list/List';
import Single from './admin/pages/single/Single';
import New from './admin/pages/new/New';
import NewProduct from './admin/pages/product/NewProduct';
import NewFirstCategory from './admin/pages/category/NewFirstCategory';
import NewSecondCategory from './admin/pages/category/NewSecondCategory';
import EditFirstCategory from './admin/pages/category/EditFirstCategory';
import EditSecondCategory from './admin/pages/category/EditSecondCategory';
import EditProduct from './admin/pages/product/EditProduct';
import EditSubProduct from './admin/pages/subproducts/EditSubProduct';
import NewSubProduct from './admin/pages/subproducts/NewSubProduct';
import AddSize from './admin/pages/size/AddSize';
import EditSize from './admin/pages/size/EditSize';
import SizeDatatable from './admin/components/datatable/SizeDatatable';
import NewAdmin from "./admin/pages/admin/NewAdmin";
import AdminLogin from "./admin/pages/login/AdminLogin";


axios.defaults.baseURL = 'http://127.0.0.1:8000/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


export const loginaxios = axios.create({
  withCredentials:true,
  baseURL:'http://127.0.0.1:8000/',
  headers:{
    'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type':'application/json',
    'Accept':'application/json',
  },
})

export const adminloginaxios = axios.create({
  withCredentials:true,
  baseURL:'http://127.0.0.1:8000/',
  headers:{
    'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type':'application/json',
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
    const isAdminLoggedIn = useSelector(state=>state.adminlogin.adminlogin)
    const dispatch = useDispatch();

    useEffect(()=>{
        if(localStorage.getItem('loggedin')){
            dispatch(loggedin());
        }else if(!localStorage.getItem('loggedin')){
            dispatch(loggedout());
        }
        if(localStorage.getItem('adminloggedin')){
            dispatch(adminloggedin());
        }else if(!localStorage.getItem('adminloggedin')){
            dispatch(adminloggedout());
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

    adminloginaxios.interceptors.response.use(
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
                localStorage.removeItem('adminloggedin');
                dispatch(adminloggedout());
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
                localStorage.removeItem('adminloggedin');
                dispatch(adminloggedout());
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

                <Route path="admin">
                    <Route index element={isAdminLoggedIn === true ? <List/> : <AdminLogin/>}/>
                    <Route path="new" element={isAdminLoggedIn === true ? <NewAdmin title='Add New Admin'/> : <AdminLogin/>}/>
                    <Route path='users'>
                        <Route index element={isAdminLoggedIn === true ? <List/> : <AdminLogin/>}/>
                        <Route path=':userId' element={isAdminLoggedIn === true ? <Single/> : <AdminLogin/>}/>
                        <Route path='new' element={isAdminLoggedIn === true ? <New title='Add New User'/> : <AdminLogin/>}/>
                    </Route>
                    <Route path='products'>
                        <Route index element={isAdminLoggedIn === true ? <List/> : <AdminLogin/>}/>
                        <Route path=':productid' element={isAdminLoggedIn === true ? <EditProduct title='Edit New Product'/> : <AdminLogin/>}/>
                        <Route path='new' element={isAdminLoggedIn === true ? <NewProduct title='Add New Product'/> : <AdminLogin/>}/>
                    </Route>
                    <Route path='subproducts'>
                        <Route index element={isAdminLoggedIn === true ? <List/> : <AdminLogin/>}/>
                        <Route path=':productid' element={isAdminLoggedIn === true ? <EditSubProduct title='Edit Sub Product'/> : <AdminLogin/>}/>
                        <Route path='new' element={isAdminLoggedIn === true ? <NewSubProduct title='Add Sub Product'/> : <AdminLogin/>}/>
                        <Route path='new/:productcode' element={isAdminLoggedIn === true ? <NewSubProduct title='Add Sub Product'/> : <AdminLogin/>}/>
                        <Route path='size/:productid' element={isAdminLoggedIn === true ?<AddSize title='Add Size, Quantity'/> : <AdminLogin/>}/>
                        <Route path='editsize/:id/:subproduct_id' element={isAdminLoggedIn === true ?<EditSize title='Add Size, Quantity'/> : <AdminLogin/>}/>
                        <Route path='viewsize/:productid' element={isAdminLoggedIn === true ? <SizeDatatable title='Add Size, Quantity'/> : <AdminLogin/>}/>
                    </Route>
                    <Route path='firstcategories'>
                        <Route index element={isAdminLoggedIn === true ? <List/> : <AdminLogin/>}/>
                        <Route path=':categoryid' element={isAdminLoggedIn === true ? <EditFirstCategory title='Edit First Category'/>: <AdminLogin/>}/>
                        <Route path='new' element={isAdminLoggedIn === true ? <NewFirstCategory title='Add New First Category'/>: <AdminLogin/>}/>
                    </Route>
                    <Route path='secondcategories'>
                        <Route index element={isAdminLoggedIn === true ?<List/> : <AdminLogin/>}/>
                        <Route path=':categoryid' element={isAdminLoggedIn === true ? <EditSecondCategory title='Edit Second Category'/> : <AdminLogin/>}/>
                        <Route path='new' element={isAdminLoggedIn === true ? <NewSecondCategory title='Add New Second Category'/> : <AdminLogin/>}/>
                    </Route>
                    <Route path='orders'>
                        <Route index element={isAdminLoggedIn === true ? <List/> : <AdminLogin/>}/>
                    </Route>
                </Route>

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
