import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import axios from 'axios'
import Swal from 'sweetalert2'
import { loginaxios } from '../../app'
import { Link, useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Modal from '@mui/material/Modal';
import { usePaymentInputs } from 'react-payment-inputs';
import { useForm } from "react-hook-form";
import { Add, Remove } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import './CheckOut.scss'

const ERROR_MESSAGES = {
    emptyCardNumber: 'カード番号を入力してください',
    invalidCardNumber: 'カード番号が正しくありません',
    emptyExpiryDate: '有効期限を入力してください',
    monthOutOfRange: '有効期限（月）は１〜１２までです',
    yearOutOfRange: 'カードの有効期限が切れています',
    dateOutOfRange: 'カードの有効期限が切れています',
    invalidExpiryDate: '有効期限が無効です',
    emptyCVC: 'セキュリティコードを入力してください',
    invalidCVC: 'セキュリティコードが無効です'
}


const week_list = ['日', '月', '火', '水', '木', '金', '土'];
let date = new Date();
let year = date.getFullYear();
let month = date.setMonth(date.getMonth())
let day = date.setDate(date.getDate() + 2)
const optionweek = [(date.getMonth() + 1) + '/' + date.getDate() + week_list[date.getDay()] + '曜日',]
let i = 1
while (i < week_list.length){
  day = date.setDate(date.getDate() + 1)
  i = i + 1;
  optionweek.push((date.getMonth() + 1) + '/' + date.getDate() + week_list[date.getDay()] + '曜日')
}


const timeArray = [
  '8:00-12:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
]


const Checkout = () => {
    const [address,setAddress] = useState({
        address_code:'',
        address1:'',
        post_code:'',
        mansion_name:'',
    })
      const [error,setError] = useState({
        address_code:'',
        address1:'',
        post_code:'',
        mansion_name:'',
        delivery_method:'',
        payment_method:'',
    })
      const [cart,setCart] = useState([])
      const [input,setInput] = useState({
        address_code:'',
        address1:'',
        post_code:'',
        mansion_name:'',
        delivery_method:'1',
        delivery_day:'',
        delivery_time:'8:00-12:00',
        payment_method:'クレジットカード',
        card_number:'',
        expiry_date:'',
        cvc:'',
        card_name:'',
        card_filter:'',
    })
    const [radio,setRadio] = useState('1')
    const [paymentRadio,setPaymentRadio] = useState('クレジットカード')
    const [open,setOpen] = useState(false)
    const [creditOpen,setCreditOpen] = useState(false)
    const [creditEditOpen,setCreditEditOpen] = useState(false)
    const [expanded,setExpanded] = useState(false)
    const [productExpanded,setProductExpanded] = useState(false)
    const [creditChecked,setCreditChecked] = useState(false)
    const [creditArray,setCreditArray] = useState([{card_number:''}])
    const [selectedCredit,setSelectedCredit] = useState([])
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state=>state.login.login)


    const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs({
        errorMessages: ERROR_MESSAGES
    });

    const { register, handleSubmit, formState: { errors }, setValue,trigger,getValues } = useForm({defaultValues:{
        cardNumber:'',
        expiryDate:'',
        cvc:'',
        cardName:'',
    }});

    const validation = (name, e) => {
        setValue(name, e.target.value, false);
        trigger(name);
    };

    useEffect(()=>{
        if(creditArray.length !== 0){
            setPaymentRadio(creditArray[0].filter)
        }else if(creditArray.length === 0){
            setPaymentRadio('クレジットカード')
        }
    },[creditArray])

    let cardNumberError = ''
    if((meta.erroredInputs.cardNumber && meta.touchedInputs.cardNumber) || !!errors?.cardNumber?.message){
        if((meta.erroredInputs.cardNumber && meta.touchedInputs.cardNumber)){
            cardNumberError = meta.erroredInputs.cardNumber
        }else if(!!errors?.cardNumber?.message){
            cardNumberError = errors?.cardNumber?.message
        }
    }

    let expiryDateError = ''
    if((meta.erroredInputs.expiryDate && meta.touchedInputs.expiryDate) || !!errors?.expiryDate?.message){
        if((meta.erroredInputs.expiryDate && meta.touchedInputs.expiryDate)){
            expiryDateError = meta.erroredInputs.expiryDate
        }else if(!!errors?.expiryDate?.message){
            expiryDateError = errors?.expiryDate?.message
        }
    }

    let cvcError = ''
    if((meta.erroredInputs.cvc && meta.touchedInputs.cvc) || !!errors?.cvc?.message){
        if((meta.erroredInputs.cvc && meta.touchedInputs.cvc)){
            cvcError = meta.erroredInputs.cvc
        }else if(!!errors?.cvc?.message){
            cvcError = errors?.cvc?.message
        }
    }

    let cardNameError = ''
    if(!!errors?.cardName?.message){
        cardNameError = errors?.cardName?.message
    }

    useEffect(()=>{
        loginaxios.get(`/api/view-info`).then(res=>{
            if(res.data.status === 200){
            setCart(res.data.cart)
            if(res.data.card.length !== 0){
                setInput({...input,address_code:res.data.user[0].address_code,address1:res.data.user[0].address1,post_code:res.data.user[0].post_code,mansion_name:res.data.user[0].mansion_name === null ? '' : res.data.user[0].mansion_name,delivery_day:optionweek[0],payment_method:'クレジットカード',card_number:res.data.card[0].card_number,card_name:res.data.card[0].credit_name,cvc:res.data.card[0].cvc,expiry_date:res.data.card[0].expiry_date,card_filter:res.data.card[0].filter})
            }else if(res.data.card.length === 0){
                setInput({...input,address_code:res.data.user[0].address_code,address1:res.data.user[0].address1,post_code:res.data.user[0].post_code,mansion_name:res.data.user[0].mansion_name === null ? '' : res.data.user[0].mansion_name,delivery_day:optionweek[0]})
            }
            setCreditArray(res.data.card)

            }else if(res.data.status === 404){

            }
        })

    },[])


    useEffect(()=>{
        let searchZip = ''
        if(address.address_code.includes('-')){
            searchZip = address.address_code.replace('-','')
        }else{
            searchZip = address.address_code
        }
        if(searchZip.length === 7){
            axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${searchZip}`).then(res=>{
            setAddress({...address,address1:res.data.results[0].address1 + res.data.results[0].address2 + res.data.results[0].address3})
            })
        }
    },[address.address_code])

    useEffect(()=>{
        setInput({...input,delivery_method:radio})
    },[radio])


    const handleQuantity = (e,type,id) =>{
        e.preventDefault();
        const selectCart = cart.filter(item=>{
            return item.id === id
        })

        const cartArray = []
        if(type === 'dec'){
            if(selectCart[0].quantity > 1){
            cart.map(item=>{
                if(item.id === id){
                cartArray.push({...item,quantity:item.quantity - 1,price:item.price - selectCart[0].sizequantityinfo[0].subproduct.product.price})
                }else if(item.id !== id){
                cartArray.push(item)
                }
            })
            loginaxios.post('api/dec-product',{id}).then(res=>{
                if(isLoggedIn){
                setCart(cartArray)
                }
            })
            }
        }else if(type === 'inc'){
            if(selectCart[0].quantity < selectCart[0].sizequantityinfo[0].quantity){
            cart.map(item=>{
                if(item.id === id){
                cartArray.push({...item,quantity:item.quantity + 1,price:item.price + selectCart[0].sizequantityinfo[0].subproduct.product.price})
                }else if(item.id !== id){
                cartArray.push(item)
                }
            })
            loginaxios.post('api/inc-product',{id}).then(res=>{
                if(isLoggedIn){
                setCart(cartArray)
                }
            })
            }
        }
    }

    const removeCart = (e,id) => {
        const result = window.confirm('本当に削除してよろしいですか？')
        if(result){
            e.preventDefault();
            const removedCart = cart.filter(item=>{
            return item.id !== id
            })
            loginaxios.post('api/remove-product',{id}).then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                title: 'Success',
                text: res.data.message,
                icon: 'success',
                confirmButtonText: 'OK'
                })
                setCart(removedCart)
            }
            })

        }
    }

    let total = 0
    cart.map(item => {
    return total += item.price
    })


    const accordionHandler = () => {
        setExpanded(!expanded)
    }

    const productAccordionHandler = () => {
        setProductExpanded(!productExpanded)
    }


    const addressHandler = (e) => {
        setAddress({...address,[e.target.name]:e.target.value})
    }

    const addressChange = (e) => {
        e.preventDefault()
        setInput({...input,address_code:address.address_code,address1:address.address1,post_code:address.post_code,mansion_name:address.mansion_name})
        setExpanded(false)
    }


    const radioHandler = (e) => {
        setRadio(e.target.value)
    };

    const deliveryHandler = (e) => {
        setRadio('3')
        setOpen(true)
    }

    const cardHandler = (e) => {
        setPaymentRadio('クレジットカード')
        setInput({...input,payment_method:'クレジットカード'})
        setCreditOpen(true)
    }

    const handleClose = () => setOpen(false);

    const handleCreditClose = () =>{
        setCreditOpen(false);
    }

    const handleCreditEditClose = () =>{
        setCreditEditOpen(false);
    }

    const dayHandler = (e) => {
        e.preventDefault()
        const day = document.getElementById('day').value
        const time = document.getElementById('time').value
        setInput({...input,delivery_day:day,delivery_time:time})
        setOpen(false);
    }

    const paymentRadioHandler = (e,key) => {
        setPaymentRadio(e.target.value)
        if(creditArray[key] !== undefined){
            setInput({...input,payment_method:e.target.value ,card_number:creditArray[key].card_number,card_name:creditArray[key].credit_name,cvc:creditArray[key].cvc,expiry_date:creditArray[key].expiry_date,card_filter:creditArray[key].filter})
        }else if(creditArray[key] === undefined){
            setInput({...input,payment_method:e.target.value ,card_number:'',card_name:'',cvc:'',expiry_date:'',card_filter:''})
        }
    }

    // const creditCheckedHandler = () =>{
    //     setCreditChecked(!creditChecked)
    // }

    const onFormSubmit = () => {

        // let creDif = 1
        // const creditDefault = document.creditForm.creditDefault
        // if(creditDefault.checked === true){
        //     creDif = 1
        // }else if(creditDefault.checked === false){
        //     creDif = 0
        // }
        const filterDate = Date.now()
        let data = {
            card_number:getValues('cardNumber'),
            expiry_date:getValues('expiryDate'),
            cvc:getValues('cvc'),
            credit_name:getValues('cardName'),
            // default:creDif,
            default:1,
            filter:filterDate
        }
        loginaxios.post('api/credit/store',data).then(res=>{
            if(res.data.status === 200){
            setInput({...input,card_number:getValues('cardNumber'),expiry_date:getValues('expiryDate'),cvc:getValues('cvc'),card_name:getValues('cardName'),card_filter:filterDate,payment_method:'クレジットカード'})
            setCreditArray([data,...creditArray])
            }
        })
        setCreditArray([data,...creditArray])
        setCreditOpen(false);
    }


    const onEditSubmit = () => {

        setPaymentRadio(selectedCredit[0].filter)
        setCreditEditOpen(false)
        let data = {
            card_number:getValues('cardNumber'),
            expiry_date:getValues('expiryDate'),
            cvc:getValues('cvc'),
            credit_name:getValues('cardName'),
            filter:selectedCredit[0].filter,
        }
        const find = creditArray.findIndex(element=>{
            return element.filter === selectedCredit[0].filter
        })
        const c = creditArray.map((creditArray,index)=>{
            return index === find ? {card_number:getValues('cardNumber'),credit_name:getValues('cardName'),cvc:getValues('cvc'),expiry_date:getValues('expiryDate'),filter:selectedCredit[0].filter} :creditArray
        })
        loginaxios.post('api/credit/update',data).then(res=>{
            if(res.data.status === 200){
            setCreditArray(c)
            setInput({...input,card_number:getValues('cardNumber'),expiry_date:getValues('expiryDate'),cvc:getValues('cvc'),card_name:getValues('cardName'),payment_method:'クレジットカード',card_filter:selectedCredit[0].filter})
            }
        })
    }


    const cardEdit = (date) => {
        setPaymentRadio(date)

        const filterCard = creditArray.filter(item=>{
            return item.filter === date
        })
        setSelectedCredit(filterCard)
        setValue('cardNumber',filterCard[0].card_number,false)
        setValue('cardName',filterCard[0].credit_name,false)
        setValue('expiryDate',filterCard[0].expiry_date,false)
        setValue('cvc',filterCard[0].cvc,false)
        setCreditChecked(true)
        setCreditEditOpen(true)
        setInput({...input,card_number:getValues('cardNumber'),expiry_date:getValues('expiryDate'),cvc:getValues('cvc'),card_name:getValues('cardName'),payment_method:'クレジットカード',card_filter:filterCard[0].filter})
    }


    const cardDelete = (date) => {
        const newcre = creditArray.filter(item=>{
            return  item.filter !== date
        })

        loginaxios.post(`api/credit/delete/${date}`).then(res=>{
            if(res.data.status === 200){
            setCreditArray(newcre)
            setValue('cardNumber','',false)
            setValue('cardName','',false)
            setValue('expiryDate','',false)
            setValue('cvc','',false)
            setCreditChecked(false)
            if(newcre.length === 0){
                setInput({...input,card_number:'',expiry_date:'',cvc:'',card_name:'',payment_method:'クレジットカード',card_filter:''})
            }else if(newcre.length !== 0){
                setInput({...input,card_number:newcre[0].card_number,expiry_date:newcre[0].expiry_date,cvc:newcre[0].cvc,card_name:newcre[0].credit_name,payment_method:'クレジットカード',card_filter:newcre[0].filter})
            }
            }
        })

    }

    const creditRegister = () => {
        setValue('cardNumber','',false)
        setValue('cardName','',false)
        setValue('expiryDate','',false)
        setValue('cvc','',false)
        setCreditChecked(false)
        setCreditOpen(true)
    }

    const orderSubmit = (e) =>{
        console.log('OK');
        e.preventDefault()
        if(cart.length === 0){
            Swal.fire({
            title: 'Error',
            text: 'カートに商品が入っていません',
            icon: 'error',
            confirmButtonText: 'OK'
            })
        }else if(cart.length !== 0){
            loginaxios.post('api/order',input).then(res=>{
            if(res.data.status === 400){
                Swal.fire({
                title: 'Error',
                text: res.data.message,
                icon: 'error',
                confirmButtonText: 'OK'
                })
            }
            if(res.data.status === 404){
                Swal.fire({
                title: 'Error',
                text: res.data.message,
                icon: 'error',
                confirmButtonText: 'OK'
                })
            }
            if(res.data.status == 200){
                Swal.fire({
                title: 'Success',
                text: res.data.message,
                icon: 'success',
                confirmButtonText: 'OK'
                })
                navigate('/')
            }
            })

        }

    }

    const toCart = () => {
        if(cart.length === 0){
            Swal.fire({
              title: 'Error',
              text: 'カートに商品が入っていません',
              icon: 'error',
              confirmButtonText: 'OK'
            })
        }else if(cart.length !== 0){
            navigate('/cart')
        }
    }

    let creditHTML = ''
    if(creditArray.length === 0){
    creditHTML =
        <div style={{marginRight:'28px',marginBottom:'8px',marginLeft:'16px'}}>
        <input className='checkoutradioinput' id='クレジットカード' value='クレジットカード' type='radio' checked={paymentRadio === 'クレジットカード'} onChange={paymentRadioHandler}></input>
        <label htmlFor='クレジットカード'>クレジットカード支払い</label>
        <small className='checkoutchangesmall' onClick={cardHandler}>カード情報の入力</small>
        </div>
    }else if(creditArray.length !== 0){
    creditHTML =
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',marginRight:'36px',marginBottom:'8px',marginLeft:'16px'}}>
        {creditArray.map((item,key)=>{
            let creditnumber = new String(item.card_number)
            creditnumber = creditnumber.replace(/ /g, '')
            let creditnumberNumber = creditnumber.length -4
            let replacecreditnumber = creditnumber.substring(0,creditnumberNumber)
            replacecreditnumber = replacecreditnumber.replace(/[0-9]/g,'*')
            creditnumber = creditnumber.substring(creditnumber.length - 4)
            creditnumber = replacecreditnumber + creditnumber
            return (
            <div>
                <input className='checkoutradioinput' key={key} id={item.filter} value={item.filter} type='radio' checked={item.filter == paymentRadio} onChange={(e)=>paymentRadioHandler(e,key)}></input>
                <label htmlFor={item.filter}>クレジットカード {creditnumber} &ensp;&ensp; 名義人：{item.credit_name} &ensp;&ensp; 有効期限（月/年）：{item.expiry_date}&ensp; </label>
                <small className='checkoutchangesmall' onClick={()=>cardEdit(item.filter)} style={{color:'green'}}>編集</small>
                <small className='checkoutchangesmall' onClick={()=>cardDelete(item.filter)} style={{color:'red'}}>削除</small>
            </div>
            )
        })}
            <small className='checkoutchangesmall' onClick={creditRegister} style={{marginLeft:'auto',marginTop:'8px'}}>カード情報の入力</small>
        </div>
    };



  return (
    <div className='checkoutcontainer'>
        <Navbar/>
        <div className='checkoutwrapper'>
            <div className='checkouttop'>

                <button className='checkouttopbutton' onClick={toCart}>カートへ戻る</button>

                <div className='checkouttoptext'>
                    <h1 className='checkoutsummarytext' style={{fontWeight:'1000'}}>注文内容</h1>
                </div>

                <Link to='/'>
                    <button className='checkouttopbutton' style={{border:'filled',backgroundColor:'black',color:'filled',color:'white'}} >トップページへ戻る</button>
                </Link>
            </div>


            <div className='checkoutbottom'>
                <div className='checkoutsummary'>
                    <div className='checkoutorderwrapper'>
                        <h2 className='checkoutordertitle'>配達住所</h2>
                        <Accordion expanded={expanded} style={{boxShadow:'none'}} square disableGutters>
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                style={{margintop:'0px'}}
                            >
                                <div className='checkoutordercontainer'>

                                    <h4 className='checkoutaddressinfo'>{input.address_code + ' ' +  input.address1 + ' ' + input.post_code + ' ' + input.mansion_name}</h4>
                                    <button className='checkoutchangebutton' style={{color:'royalblue'}} onClick={accordionHandler}>配達先の変更</button>

                                </div>
                            </AccordionSummary>
                            <AccordionDetails>


                                <div className='checkoutinputscontainer'>
                                    <div className='checkoutaddresscontainer'>
                                        <span className='checkoutinputlabel' >郵便番号:</span>
                                        <input className='checkoutinput' type='text' name='address_code' value={address.address_code} onChange={addressHandler}></input>
                                    </div>
                                    <small style={{color:'red',diaplay:'block'}}>{error.address_code}</small>
                                    <div className='checkoutaddresscontainer'>
                                        <span className='checkoutinputlabel'>住所:</span>
                                        <input className='checkoutinput' type='text' name='address1' value={address.address1} onChange={addressHandler}></input>
                                    </div>
                                    <small style={{color:'red'}}>{error.address1}</small>
                                    <div className='checkoutaddresscontainer'>
                                        <span className='checkoutinputlabel'>丁目/番地/号:</span>
                                        <input className='checkoutinput' type='text' name='post_code' value={address.post_code} onChange={addressHandler}></input>
                                    </div>
                                    <small style={{color:'red'}}>{error.post_code}</small>
                                    <div className='checkoutaddresscontainer'>
                                        <span className='checkoutinputlabel'>建物名:</span>
                                        <input className='checkoutinput' type='text' name='mansion_name' value={address.mansion_name} onChange={addressHandler}></input>
                                    </div>
                                    <button className='checkoutbutton' onClick={addressChange} disabled={!address.address_code||!address.address1 || !address.post_code} style={{backgroundColor: !address.address_code||!address.address1 || !address.post_code ? 'gray' : 'black'}}>変更</button>
                                </div>


                            </AccordionDetails>
                        </Accordion>
                    </div>

                    <div className='checkoutorderwrapper'>
                        <h2 className='checkoutordertitle'>配達方法</h2>
                        <div className='checkoutradiocontainer'>
                            <div className='checkoutradiowrapper' style={{marginLeft:'16px'}}>
                                <input className='checkoutradioinput' id='1' value='1' type='radio' checked={radio === '1'} onChange={radioHandler}></input>
                                <label htmlFor='1'>通常配送</label>
                            </div>

                            <div className='checkoutradiowrapper'>
                                <input className='checkoutradioinput' id='2' value='2' type='radio' checked={radio === '2'} onChange={radioHandler}></input>
                                <label htmlFor='2'>お急ぎ便</label>

                            </div>
                            <div className='checkoutradiowrapper'>
                                <input className='checkoutradioinput' id='3' value='3' type='radio' checked={radio === '3'} onChange={radioHandler}></input>
                                <label htmlFor='3'>日時指定便</label>
                                <small style={{color:'green',marginLeft:'8px'}}>{input.delivery_day + ' ' + input.delivery_time}配達予定</small>
                                <small className='checkoutchangesmall' onClick={deliveryHandler}>配達日時の変更</small>
                            </div>
                        </div>
                    </div>

                    <div className='checkoutorderwrapper'>
                        <h2 className='checkoutordertitle'>支払い方法</h2>
                        <div className='checkoutcreditradiowrapper'>
                            <div className='checkoutcreditleft'>
                                {creditHTML}
                            </div>
                            <div className='checkoutcredirright'>
                                <input className='checkoutcreditradioinput' id='paymentradio2' value='代金引換' type='radio' checked={paymentRadio === '代金引換'} onChange={paymentRadioHandler}></input>
                                <label htmlFor='paymentradio2'>代金引換</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Accordion expanded={productExpanded} style={{boxShadow:'none'}} square disableGutters>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            style={{margintop:'0px',padding:'0px'}}
                        >
                        <div style={{display:'flex'}}>
                            <h2 className='checkoutordertitle'>合計金額</h2>
                            <button className='checkoutchangebutton' style={{color:'royalblue'}} onClick={productAccordionHandler}>購入商品を見る</button>
                        </div>


                        <span className='checkoutsummaryitemprice'>¥{total.toLocaleString()}</span>
                        </AccordionSummary>
                        <AccordionDetails>

                        {cart.map((product)=>{
                        return (
                            <div className='checkoutproduct' key={product.id}>
                                <div className='checkoutproductdetail'>
                                    <img className='checkoutimage' src={`http://localhost:8000/${product.sizequantityinfo[0].subproduct.topimage}`} />
                                    <div className='checkoutdetails'>
                                        <span className='checkoutproductname'>
                                            <b>Product:</b> {product.sizequantityinfo[0].subproduct.product.product_name}
                                        </span>
                                        <span className='checkoutproductid'>
                                            <b>CODE:</b> {product.id}
                                        </span>
                                        <span className='checkoutproductid'>
                                        <b>Color:</b> {product.sizequantityinfo[0].subproduct.color}
                                        </span>
                                        <span className='checkoutproductsize'>
                                            <b>Size:</b> {product.sizequantityinfo[0].size}
                                        </span>
                                    </div>
                                </div>
                                <div className='checkoutpricedetail'>
                                    <div className='checkoutproductamountcontainer'>
                                        <Add onClick={(e)=>handleQuantity(e,'inc',product.id)}/>
                                        <div className='checkoutproductamount'>{product.quantity}</div>
                                        <Remove onClick={(e)=>handleQuantity(e,'dec',product.id)}/>
                                        <button className='checkoutremovebutton' onClick={(e)=>removeCart(e,product.id)}>Remove</button>
                                    </div>
                                    <div className='checkoutproductprice'>¥ {product.price.toLocaleString()}</div>
                                </div>
                            </div>
                        )})
                        }
                        </AccordionDetails>
                        </Accordion>
                    </div>
                    <button className='checkoutbutton' onClick={orderSubmit}>注文を確定する</button>

                </div>
            </div>



            <Modal open={open} onClose={handleClose}>
                <div className='checkoutmodalcontainer'>
                    <h1 className='checkoutmodaltitle'>配達日時の変更</h1>
                    <form className='checkoutform'>
                        <div className='checkoutmodalwrapper'>
                            <span className='checkoutinputlabel'>配達日の指定：</span>
                            <select className='checkoutselect' id='day' name='delivery_day'>
                                {optionweek.map((item,key)=>{
                                return <option selected={input.delivery_day === item ? true : false} key={key}>{item}</option>
                                })}
                            </select>
                        </div>
                        <div className='checkoutmodalwrapper'>
                            <span className='checkoutinputlabel'>配達時間の指定：</span>
                            <select className='checkoutselect' id='time' name='delivery_time' >
                                {timeArray.map((item,key)=>{
                                return <option selected={input.delivery_time === item ? true : false} key={key}>{item}</option>
                                })}
                            </select>
                        </div>
                        <button className='checkoutbutton' onClick={dayHandler} style={{marginTop:'32px'}}>日時変更</button>
                    </form>
                </div>
            </Modal>

            <Modal open={creditOpen} onClose={handleCreditClose}>
            <div className='checkoutcreditmodalcontainer'>
                <h1 className='checkoutmodaltitle'>クレジットカード情報の入力</h1>
                <form className='checkoutform' onSubmit={handleSubmit(onFormSubmit)} name='creditForm'>
                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>カード番号：</span>
                <input
                {...register('cardNumber',{
                    required:'カード番号を半角数字で入力してください'
                })}
                value={getValues('cardNumber')}
                {...getCardNumberProps({ onChange: validation.bind(null, "cardNumber") })}/>
                </div>
                <h6 className='checkouterrortypo'>{cardNumberError}</h6>

                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>有効期限：</span>
                <input
                {...register('expiryDate',{
                    required:'有効期限を半角数字で入力してください',
                })}
                value={getValues('expiryDate')}
                {...getExpiryDateProps({ onChange: validation.bind(null, "expiryDate") })}/>
                </div>
                <h6 className='checkouterrortypo'>{expiryDateError}</h6>
                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>CVC：</span>
                <input
                {...register('cvc',{
                    required:'CVCを半角数字で入力してください'
                })}
                value={getValues('cvc')}
                {...getCVCProps({ onChange: validation.bind(null, "cvc") })}/>
                </div>
                <h6 className='checkouterrortypo'>{cvcError}</h6>

                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>カード名義人：</span>
                <input
                {...register('cardName',{
                    required:'名義人を入力してください'
                })} value={getValues('cardName')} onChange={validation.bind(null, "cardName")}/>
                </div>
                <h6 className='checkouterrortypo'>{cardNameError}</h6>
                <div className='checkoutmodalwrapper'>
                {/* <span className='checkoutinputlabel'>デフォルト登録：</span>
                <input type='checkbox' name='creditDefault' onChange={creditCheckedHandler} checked={creditChecked}/> */}
                </div>
                {/* <input type='submit'></input> */}
                {/* <Button onClick={cardInfoSubmit} style={{marginTop:'32px'}}>登録</Button> */}
                <button className='checkoutbutton' style={{marginTop:'32px'}}>登録</button>
                </form>


            </div>

            </Modal>



            <Modal open={creditEditOpen} onClose={handleCreditEditClose}>
            <div className='checkoutcreditmodalcontainer'>
                <h1 className='checkoutmodaltitle'>クレジットカード情報の入力</h1>
                <form className='checkoutform' onSubmit={handleSubmit(onEditSubmit)} name='creditForm'>
                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>カード番号：</span>
                <input
                {...register('cardNumber',{
                    required:'カード番号を半角数字で入力してください'
                })}
                value={getValues('cardNumber')}
                {...getCardNumberProps({ onChange: validation.bind(null, "cardNumber") })}/>
                </div>
                <h6 className='checkouterrortypo'>{cardNumberError}</h6>

                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>有効期限：</span>
                <input
                {...register('expiryDate',{
                    required:'有効期限を半角数字で入力してください',
                })}
                value={getValues('expiryDate')}
                {...getExpiryDateProps({ onChange: validation.bind(null, "expiryDate") })}/>
                </div>
                <h6 className='checkouterrortypo'>{expiryDateError}</h6>

                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>CVC：</span>
                <input
                {...register('cvc',{
                    required:'CVCを半角数字で入力してください'
                })}
                value={getValues('cvc')}
                {...getCVCProps({ onChange: validation.bind(null, "cvc") })}/>
                </div>
                <h6 className='checkouterrortypo'>{cvcError}</h6>

                <div className='checkoutmodalwrapper'>
                <span className='checkoutinputlabel'>カード名義人：</span>
                <input
                {...register('cardName',{
                    required:'名義人を入力してください'
                })} value={getValues('cardName')} onChange={validation.bind(null, "cardName")}/>
                </div>
                <h6 className='checkouterrortypo'>{cardNameError}</h6>
                <button className='checkoutbutton' style={{marginTop:'32px'}}>登録</button>
                </form>


            </div>

            </Modal>

        </div>
        <Footer/>
    </div>
  )
}

export default Checkout
