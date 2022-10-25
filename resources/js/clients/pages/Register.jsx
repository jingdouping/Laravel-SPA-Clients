import { Step, StepLabel, Stepper } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginaxios } from '../../app'
import { useDispatch } from 'react-redux'
import { loggedin } from '../redux/loginRedux'
import './Register.scss'


const steps = [
    '住所情報',
    'ユーザー情報',
    '登録確認',
]

const Register = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [order,setOrder] = useState(0)
    const [disabled,setDisabled] = useState(true)
    const [error,setError] = useState([])
    const [registerInput,setRegister] = useState({
        address_code:'',
        address1:'',
        post_code:'',
        mansion_name:'',
        name:'',
        email:'',
        password:'',
        password_confirmation:'',
    });

    const checkInput = () =>{
        if(order === 0 && registerInput.address1 && registerInput.address1 && registerInput.post_code){
        setDisabled(false)
        }else if(order === 1 && registerInput.name && registerInput.email && registerInput.password && registerInput.password_confirmation === registerInput.password){
        setDisabled(false)
        }else if(order === 2 && registerInput.address1 && registerInput.address1 && registerInput.post_code && registerInput.name && registerInput.email && registerInput.password && registerInput.password_confirmation === registerInput.password){
        setDisabled(false)
        }else{
        setDisabled(true)
        }
    }

    useEffect(()=>{
        let searchZip = ''
        if(registerInput.address_code.includes('-')){
        searchZip = registerInput.address_code.replace('-','')
        }else{
        searchZip = registerInput.address_code
        }
        if(searchZip.length === 7){
        axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${searchZip}`).then(res=>{
        setRegister({...registerInput,address1:res.data.results[0].address1+res.data.results[0].address2+res.data.results[0].address3})
        })
        }
    },[registerInput.address_code])

    useEffect(()=>{
        checkInput()
    },[registerInput,order])

    const handleInput = (e) => {
        setRegister({...registerInput,[e.target.name]:e.target.value});
    }

    const nextHandler = (e)=>{
        e.preventDefault()
        if(order === 0){
        setOrder(1)
        }else if(order === 1){
        setOrder(2)
        }
    }

    const prevHandler = (e) =>{
        e.preventDefault()
        if(order === 1){
        setOrder(0)
        }else if(order === 2){
        setOrder(1)
        }
        setDisabled(false)
    }


    const registerSubmit = (e) => {
        e.preventDefault();
        loginaxios.get('/sanctum/csrf-cookie').then(response => {
            loginaxios.post('/register',registerInput).then(res=>{
                if(res.data.status === 200){
                    localStorage.setItem('auth_name',res.data.username);
                    localStorage.setItem('loggedin',true);
                    dispatch(loggedin());
                    navigation('/');
                }else{
                    setError(res.data.validation_errors);
                }
            })
        });
    }

    let InputsTitle = '';
    if(order === 0){
        InputsTitle = '住所情報の入力';
    }else if(order === 1){
        InputsTitle = 'ユーザー情報の入力'
    }else if(order === 2){
        InputsTitle = '登録確認'
    }

    let Inputs = ''
    if(order === 0){
        Inputs = (
        <div className='registerwrapper'>
            <h1 className='registertitle'>
            {InputsTitle}
            </h1>
            <Stepper sx={{m:2}} activeStep={order} alternativeLabel>
            {steps.map((label) => (
            <Step key={label}>
                <StepLabel>{label}</StepLabel>
            </Step>
            ))}
            </Stepper>
            <div className='registerinputscontainer'>
                <div className='registercontainer'>
                    <span className='registerinputlabel'>郵便番号:</span>
                    <input className='registerinput' type='text' name='address_code' onChange={handleInput} value={registerInput.address_code}></input>
                </div>
                <div className='registercontainer'>
                    <span className='registerinputlabel'>住所:</span>
                    <input className='registerinput' type='text' name='address1' value={registerInput.address1} onChange={handleInput}></input>
                </div>
                <div className='registercontainer'>
                    <span className='registerinputlabel'>丁目/番地/号:</span>
                    <input className='registerinput' type='text' name='post_code' value={registerInput.post_code} onChange={handleInput}></input>
                </div>
                <div className='registercontainer'>
                    <span className='registerinputlabel'>建物名:</span>
                    <input className='registerinput' type='text' name='mansion_name' value={registerInput.mansion_name} onChange={handleInput}></input>
                </div>
                <button className={`registerbutton ${disabled ? 'disabled' :''}`} disabled={disabled} onClick={nextHandler}>Next &raquo;</button>
            </div>
        </div>
        )
    }else if(order === 1){
        Inputs = (
        <div className='registerwrapper'>
            <h1 className='registertitle'>
                {InputsTitle}
            </h1>
            <Stepper sx={{m:2}} activeStep={order} alternativeLabel>
            {steps.map((label) => (
            <Step key={label}>
                <StepLabel>{label}</StepLabel>
            </Step>
            ))}
            </Stepper>
            <div className='registerinputscontainer'>

                <div className='registercontainer'>
                    <span className='registerinputlabel'>ユーザー名:</span>
                    <input className='registerinput' placeholder='name' type='name' name='name' value={registerInput.name} onChange={handleInput}/>
                </div>

                <div className='registercontainer'>
                    <span className='registerinputlabel'>Email:</span>
                    <input className='registerinput' placeholder='email' type='email' name='email' value={registerInput.email} onChange={handleInput}/>
                </div>

                <div className='registercontainer'>
                    <span className='registerinputlabel'>Password:</span>
                    <input className='registerinput' placeholder='password' type='password' name='password' value={registerInput.password} onChange={handleInput}/>
                </div>

                <div className='registercontainer'>
                    <span className='registerinputlabel'>パスワード確認:</span>
                    <input className='registerinput' placeholder='confirm password' type='password' name='password_confirmation' value={registerInput.password_confirmation} onChange={handleInput}/>
                </div>

                <div className='registerbuttoncontainer'>
                    <button className='registerbutton prev notenter' onClick={prevHandler}>&laquo; Prev</button>
                    <button className={`registerbutton ${disabled ? 'disabled prev' :'prev'}`} disabled={disabled} onClick={nextHandler}>Next &raquo;</button>
                </div>
            </div>
        </div>
        )
    }else if(order === 2){
        Inputs = (
        <div className='registerwrapper2'>
            <h1 className='registertitle2'>
                {InputsTitle}
            </h1>
            <Stepper sx={{m:2}} activeStep={order} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <form className='registerform2'>
                <div className='registercontainer2'>
                    <span className='registerinputlabel2' >郵便番号:</span>
                    <input className='registerinput2' type='text' name='address_code' onChange={handleInput} value={registerInput.address_code}></input>
                </div>
                    <small style={{color:'red'}}>{error.address_code}</small>
                <div className='registercontainer2'>
                    <span className='registerinputlabel2'>住所:</span>
                    <input className='registerinput2' type='text' name='address1' value={registerInput.address1} onChange={handleInput}></input>
                </div>
                    <small style={{color:'red'}}>{error.address1}</small>
                <div className='registercontainer2'>
                    <span className='registerinputlabel2'>丁目/番地/号:</span>
                    <input className='registerinput2' type='text' name='post_code' value={registerInput.post_code} onChange={handleInput}></input>
                </div>
                    <small style={{color:'red'}}>{error.post_code}</small>
                <div className='registercontainer2'>
                    <span className='registerinputlabel2'>建物名:</span>
                    <input className='registerinput2' type='text' name='mansion_name' value={registerInput.mansion_name} onChange={handleInput}></input>
                </div>
                    <small style={{color:'red'}}>{error.mansion_name}</small>
                <div className='registercontainer2'>
                    <span className='registerinputlabel2'>ユーザー名:</span>
                    <input className='registerinput2' placeholder='name' type='name' name='name' value={registerInput.name} onChange={handleInput}/>
                </div>
                <small style={{color:'red'}}>{error.name}</small>

                <div className='registercontainer2'>
                    <span className='registerinputlabel2'>Email:</span>
                    <input className='registerinput2' placeholder='email' type='email' name='email' value={registerInput.email} onChange={handleInput}/>
                </div>
                <small style={{color:'red'}}>{error.email}</small>

                <div className='registercontainer2'>
                    <span className='registerinputlabel2'>Password:</span>
                    <input className='registerinput2' placeholder='password' type='password' name='password' value={registerInput.password} onChange={handleInput}/>
                </div>
                <small style={{color:'red'}}>{error.password}</small>
                <div className='registercontainer2'>
                    <span className='registerinputlabel2'>パスワード確認:</span>
                    <input className='registerinput2' placeholder='confirm password' type='password' name='password_confirmation' value={registerInput.password_confirmation} onChange={handleInput}/>
                </div>
                <small style={{color:'red'}}>{error.password_confirmation}</small>
                <div className='registerbuttoncontainer2'>
                    {/* <Button className='prev' onClick={prevHandler}>&laquo; Prev</Button> */}
                    {/* <Button className={disabled ? 'disabled' :''} disabled={disabled} onClick={registerSubmit}>登録する</Button> */}
                    <button className='registerbutton2' onClick={registerSubmit}>登録する</button>
                </div>
            </form>
        </div>
        )
    }



  return (
    <div className='bigregistercontainer'>
        {Inputs}
    </div>
  )
}

export default Register
