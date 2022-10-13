import React from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import Announcement from './Announcement';

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state=>state.login.login)

 const navigation = useNavigate();


  const logoutHandler = (e) => {
    e.preventDefault();


    loginaxios.post('/api/logout').then(res=>{
      if(res.data.status === 200){
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_name');
        localStorage.removeItem('loggedin');
        dispatch(loggedout())
        navigation('/');
      }
    })
  };

  let AuthButtons = '';

  if(!isLoggedIn){
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


  return (
    <>
        <div className='container'>
            <div className='wrapper'>
                <div className='left'>
                </div>
                <div className='center'>
                    <h1 className='logo'>Fashion Site</h1>
                </div>
                <div className='right'>
                    {AuthButtons}
                    <Link to='/cart'>
                        <div className='menuitem'>
                            <ShoppingCartIcon/>
                        </div>
                    </Link>
                </div>
            </div>

        </div>
        <Announcement/>
    </>
  )
}

export default Navbar
