import React, { useEffect } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import Announcement from './Announcement';
import { loginaxios } from '../../app';
import {loggedout} from '../redux/loginRedux'
import Swal from 'sweetalert2';

const Navbar = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state=>state.login.login)

 const navigation = useNavigate();

  const logoutHandler = (e) => {
    e.preventDefault();
    loginaxios.post('/api/logout').then(res=>{
      if(res.data.status === 200){
        localStorage.removeItem('auth_name');
        localStorage.removeItem('loggedin');
        dispatch(loggedout())
        navigation('/');
      }
    })
  };

  let AuthButtons = '';



  if(!localStorage.getItem('loggedin')){
    AuthButtons = (
      <>
        <Link to='/register'>
          <div className='menuitem'>Register</div>
        </Link>
        <Link to='/login' >
          <div className='menuitem'>Sign In</div>
        </Link>
    </>
    )
  }else{
    AuthButtons = (
      <div className='menuitem' onClick={logoutHandler}>Sign Out</div>
    )
  }

  const toCart =()=>{
    if(localStorage.getItem('loggedin')){
        navigate('/cart');
    }else if(!localStorage.getItem('loggedin')){
        Swal.fire({
            title: 'Error',
            text: 'カートを見るにはログインしてください',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
  }


  return (
    <>
        <div className='container'>
            <div className='wrapper'>
                <div className='left'>
                </div>
                <div className='center'>
                    <Link to='/' style={{color:'black',textDecoration:'none'}}>
                        <h1 className='logo'>Fashion Site</h1>
                    </Link>
                </div>
                <div className='right'>
                    {AuthButtons}

                    <div onClick={toCart} className='menuitem'>
                        <ShoppingCartIcon/>
                    </div>

                </div>
            </div>

        </div>
        <Announcement/>
    </>
  )
}

export default Navbar
