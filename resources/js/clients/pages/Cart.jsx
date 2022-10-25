import { Add, Remove } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Swal from 'sweetalert2'
import { loginaxios } from '../../app'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { loggedout,loggedin } from '../redux/loginRedux'
import './Cart.scss'


const Cart = () => {
    const [cart,setCart] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state=>state.login.login)

    useEffect(()=>{
      loginaxios.get(`/api/view-cart`).then(res=>{
        if(res.data.status === 200){
          setCart(res.data.cart)
        }else if(res.data.status === 404){

        }
      })
    },[])


    const handleQuantity = (e,type,id) =>{
      e.preventDefault();
      const selectCart = cart.filter(item=>{
        return item.id === id
      })
      const cartArray = []
      if(type === 'dec'){
        if(selectCart[0].quantity > 1){
          loginaxios.post('api/dec-product',{id}).then(res=>{
            if(res.data.status === 200){
                cart.map(item=>{
                    if(item.id === id){
                      cartArray.push({...item,quantity:item.quantity - 1,price:item.price - selectCart[0].sizequantityinfo[0].subproduct.product.price})
                    }else if(item.id !== id){
                      cartArray.push(item)
                    }
                })
                if(isLoggedIn){
                  setCart(cartArray)
                }
            }
          })
        }
      }else if(type === 'inc'){
          if(selectCart[0].quantity < selectCart[0].sizequantityinfo[0].quantity){
            loginaxios.post('api/inc-product',{id}).then(res=>{
                if(res.data.status === 200){
                    cart.map(item=>{
                        if(item.id === id){
                        cartArray.push({...item,quantity:item.quantity + 1,price:item.price + selectCart[0].sizequantityinfo[0].subproduct.product.price})
                        }else if(item.id !== id){
                        cartArray.push(item)
                        }
                    })
                    if(isLoggedIn){
                    setCart(cartArray)
                    }
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
              text: 'カートから商品を削除しました',
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

    const toOrder = () => {
      if(cart.length === 0){
        Swal.fire({
          title: 'Error',
          text: 'カートに商品が入っていません',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }else if(cart.length !== 0){
        navigate('/checkout')
      }
    }


  return (
    <div className='cartcontainer'>
        <Navbar/>
        <div className='cartwrapper'>
            <div className='carttop'>
                <Link to='/'>
                    <button className='carttopbutton'>トップページに戻る</button>
                </Link>
                <div className='carttoptext'>
                    <h1 className='carttoptitle' style={{fontWeight:'1000'}}>カート</h1>
                </div>
                <button className='carttopbutton' style={{border:'filled',backgroundColor:'black',color:'filled',color:'white'}} type='filled' onClick={toOrder}>レジへ進む</button>
            </div>
            <div className='cartbottom'>
                <div className='cartinfo'>
                    {cart.map((product)=>{
                        return (
                            <div className='cartproduct' key={product.id}>
                                <div className='cartproductdetail'>
                                    <img className='cartproductimage' src={`http://localhost:8000/${product.sizequantityinfo[0].subproduct.topimage}`} />
                                    <div className='cartdetails'>
                                        <span className='cartproductname'>
                                            <b>Product:</b> {product.sizequantityinfo[0].subproduct.product.product_name}
                                        </span>
                                        <span className='cartproductid'>
                                            <b>CODE:</b> {product.id}
                                        </span>
                                        <span className='cartproductid'>
                                        <b>Color:</b> {product.sizequantityinfo[0].subproduct.color}
                                        {/* <ProductColor color={product.subproduct[0].color} /> */}
                                        </span>

                                        <span className='cartproductsize'>
                                            <b>Size:</b> {product.sizequantityinfo[0].size}
                                        </span>
                                    </div>
                                </div>
                                <div className='cartpricedetail'>
                                    <div className='cartproductamountdetail'>
                                        <Add onClick={(e)=>handleQuantity(e,'inc',product.id)}/>
                                        <div className='cartproductamount'>{product.quantity}</div>
                                        <Remove onClick={(e)=>handleQuantity(e,'dec',product.id)}/>
                                        <button className='cartremovebutton' onClick={(e)=>removeCart(e,product.id)}>Remove</button>
                                    </div>
                                    <div className='cartproductprice'>¥ {product.price.toLocaleString()}</div>
                                </div>
                            </div>
                        )})
                    }
                    <hr/>
                </div>

                <div className='cartsummary'>
                    <h1 className='cartsummarytitle'>注文金額</h1>
                    <div className='cartsummaryitem'>

                    </div>
                    <div className='cartsummaryitem'>
                        <span className='cartsummarytext'>合計金額</span>
                        <span className='cartsummaryprice'>¥ {total.toLocaleString()}</span>

                    </div>

                    <button className='cartsummarybutton' onClick={toOrder}>レジへ進む</button>



                </div>
            </div>
        </div>

        <Footer/>

    </div>
  )
}

export default Cart
