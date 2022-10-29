import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './PasswordReset.scss'

const PasswordReset = () => {

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState({
        email:''
    })

    const [email,setEmail] = useState({
        email:''
    })

    const handleInput = (e) => {
        setEmail({...email,[e.target.name]:e.target.value})
    }

    const handleClick = (e) => {
        setLoading(true)
        e.preventDefault()
        axios.post('/api/forgot-password',email).then(res=>{
            if(res.data.status === 401){
                setLoading(false)
                setError(res.data.validation_errors)
            }else{
                Swal.fire({
                    title: 'Success',
                    text: 'パスワードリセットメールを送信しました。',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                setLoading(false)
                setError({
                    email:''
                })
            }
        })
    }

    let html = ''
    if(loading === false){
        html = (
            <div className='logincontainer'>
                <div className='loginwrapper'>
                    <h1 className='logintitle'>パスワードリセット</h1>
                    <form className='loginform'>
                        <input className='logininput' placeholder="email" type='email' value={email.email} name='email' onChange={handleInput} />
                        <small style={{color:'red'}}>{error.email}</small>
                        <button className='loginbutton' onClick={handleClick}>メール送信</button>
                    </form>
                    <Link to='/login' style={{textDecoration:'none'}}>
                    <span className='register'>ログイン画面へ戻る</span>
                    </Link>
                </div>
            </div>
        )
    }else if(loading === true){
        html = (
            <div className='logincontainer'>
                <div className='loginwrapper'>
                    <h1 className='logintitle'>パスワードリセット</h1>
                    <CircularProgress size='100px' className='loading'/>
                </div>
            </div>
        )
    }

  return (
    <>
        {html}
    </>
  )
}

export default PasswordReset
