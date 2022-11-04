import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {tologinaxios } from '../../app.jsx'
import { loggedin } from '../../redux/loginRedux'
import { useDispatch } from 'react-redux'
import './Login.scss';
import Swal from 'sweetalert2'

const Login = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [error,setError] = useState([])

    const [loginInput,setLoginInput] = useState({
        email:'',
        password:'',
    })

    const handleInput = (e) => {
        setLoginInput({...loginInput,[e.target.name]:e.target.value})
    }


    const handleClick = (e) => {
        e.preventDefault()
        const data = {
        email:loginInput.email,
        password:loginInput.password,
        }
        tologinaxios.get('/sanctum/csrf-cookie').then(response => {
        tologinaxios.post('/login',data).then(res=>{
        if(res.data.status === 200){
        localStorage.setItem('auth_name',res.data.username);
        localStorage.setItem('loggedin',true);
        dispatch(loggedin());
        if(res.data.role === 'admin'){
            navigation('/admin');
        }else{
            navigation('/');
        }
        }else if(res.data.status === 401){
        setError({password:res.data.message})
        }else{
        setError(res.data.validation_errors)
        }
        }).catch(error => {
            if(error.response.status === 429){
                Swal.fire({
                    title: 'Error',
                    text:'ログインに５回失敗しました。５分後に再開できます。',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        });
        });
    }

    const passwordForget = () => {
        navigation('/passwordreset')
    }

  return (
    <div className='logincontainer'>
        <div className='loginwrapper'>
            <h1 className='logintitle'>ログイン</h1>
            <form className='loginform'>
                <input className='logininput' placeholder="email" type='email' name='email' onChange={handleInput} />
                <small style={{color:'red'}}>{error.email}</small>
                <input className='logininput' placeholder="password" type='password' name='password' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.password}</small>
                <button className='loginbutton' onClick={handleClick}>ログイン</button>
            </form>
            <span onClick={passwordForget} className='passwordreset'>パスワードリセット</span>
            <Link to='/register' style={{textDecoration:'none'}}>
            <span className='register'>新規登録</span>
            </Link>
        </div>

    </div>
  )
}

export default Login
