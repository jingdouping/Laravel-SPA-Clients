import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { loginaxios } from '../../app.jsx'
import { loggedin } from '../redux/loginRedux'
import { useDispatch } from 'react-redux'
import './ResetPassword.scss';
import Swal from 'sweetalert2'

const ResetPassword = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [error,setError] = useState([]);
    let {token} = useParams()

    const [loginInput,setLoginInput] = useState({
        token:token,
        email:'',
        password:'',
        password_confirmation:'',
    })

    const handleInput = (e) => {
        setLoginInput({...loginInput,[e.target.name]:e.target.value})
    }

    console.log(loginInput);

    const handleClick = (e) => {
        e.preventDefault()
        axios.post('/api/reset-password',loginInput).then(res=>{
            if(res.data.status === 401){
                setError(res.data.validation_errors)
            }else{
                setError([])
                Swal.fire({
                    title: 'Success',
                    text: 'パスワード変更完了いたしました。',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
            }
        }).catch(error => {
            if(error.response.status === 422){
                console.log(error);
                Swal.fire({
                    title: 'Error',
                    text:error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        });
    }

  return (
    <div className='logincontainer'>
        <div className='loginwrapper'>
            <h1 className='logintitle'>パスワードリセット</h1>
            <form className='loginform'>
                <input className='logininput' placeholder="email" type='email' name='email' onChange={handleInput} />
                <small style={{color:'red'}}>{error.email}</small>
                <input className='logininput' placeholder="password" type='password' name='password' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.password}</small>
                <input className='logininput' placeholder="confirm password" type='password' name='password_confirmation' onChange={handleInput}/>
                <button className='loginbutton' onClick={handleClick}>パスワードリセット</button>
            </form>
        </div>

    </div>
  )
}

export default ResetPassword
