import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginaxios } from '../../app'
import { loggedin } from '../redux/loginRedux'
import { useDispatch } from 'react-redux'
import './Login.scss';

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


        loginaxios.get('/sanctum/csrf-cookie').then(response => {
        loginaxios.post('/login',data).then(res=>{
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

        })
        });
    }

  return (
    <div className='logincontainer'>
        <div className='loginwrapper'>
            <h1 className='logintitle'>ログイン</h1>
            <form className='loginform'>
                {/* <input type="hidden" name="_token" value={csrf_token} /> */}
                <input className='logininput' placeholder="email" type='email' name='email' onChange={handleInput} />
                <small style={{color:'red'}}>{error.email}</small>
                <input className='logininput' placeholder="password" type='password' name='password' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.password}</small>
                <button className='loginbutton' onClick={handleClick}>ログイン</button>
            </form>
        </div>

    </div>
  )
}

export default Login
