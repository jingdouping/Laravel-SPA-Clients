import React from 'react'
import './sidebar.scss';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Link, useNavigate } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import { tologinaxios } from '../../../app';
import { adminloggedout } from '../../../redux/adminloginRedux'
import { useDispatch } from 'react-redux'

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const logoutHandler =(e)=>{
        e.preventDefault();
        localStorage.removeItem('auth_name');
        localStorage.removeItem('adminloggedin');
        dispatch(adminloggedout())
        navigation('/admin');
    }

  return (
    <div className='sidebar'>
      <div className='top'>
        <Link to='/admin' style={{textDecoration:'none'}}>
          <span className='logo'>FashionAdmin</span>
        </Link>
      </div>
      <hr/>
      <div className='center'>
        <ul>

          <p className='title'>Lists</p>
          <Link to='/admin/users' style={{textDecoration:'none'}}>
            <li>
              <PersonOutlineOutlinedIcon className='icon'/>
              <span>ユーザー</span>
            </li>
          </Link>
          <Link to='/admin/firstcategories' style={{textDecoration:'none'}}>
            <li>
              <CategoryIcon className='icon'/>
              <span>第一カテゴリー</span>
            </li>
          </Link>
          <Link to='/admin/secondcategories' style={{textDecoration:'none'}}>
            <li>
              <BookmarkIcon className='icon'/>
              <span>第二カテゴリー</span>
            </li>
          </Link>
          <Link to='/admin/products' style={{textDecoration:'none'}}>
            <li>
              <StorefrontIcon className='icon'/>
              <span>品番</span>
            </li>
          </Link>
          <Link to='/admin/subproducts' style={{textDecoration:'none'}}>
            <li>
              <Inventory2Icon className='icon'/>
              <span>商品</span>
            </li>
          </Link>
          <Link to='/admin/orders' style={{textDecoration:'none'}}>
            <li>
              <CreditCardIcon className='icon'/>
              <span>オーダー</span>
            </li>
          </Link>
            <li onClick={logoutHandler}>
                <LogoutIcon className='icon'/>
                <span>ログアウト</span>
            </li>
        </ul>
      </div>
      <div className='bottom'>
        <div className='colorOption' onClick={()=>dispatch({type:'LIGHT'})}></div>
        <div className='colorOption' onClick={()=>dispatch({type:'DARK'})}></div>
      </div>
    </div>
  )
}

export default Sidebar
