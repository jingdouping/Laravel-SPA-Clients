import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {SwiperSlide,Swiper } from 'swiper/react';
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import './Product.scss';
import { loginaxios } from '../../app';
import Swal from 'sweetalert2';

const Product = () => {
    const location = useLocation();
    const id = location.pathname.split('/')[2];
    const [product,setProduct] = useState([]);
    const [selectProduct,setSelectProduct] = useState([]);
    const [quantity,setQuantity] = useState(1);
    const [color,setColor] = useState('');
    const [size,setSize] = useState('');
    const [sizeError,setSizeError] = useState(false);
    const [productSize,setProductSize] = useState([]);
    const [mount,setMount] = useState(false);
    const navigate = useNavigate();

    let {product_code} = useParams();
    let {onlyid} = useParams();

    const [sizeArray1,setSizeArray1] = useState([]);
    const [topImage,setTopImage] = useState('');
    const [imageFocus,setImageFocus] = useState('topimage');
    const [productQuantity,setProductQuantity] = useState();
    const [sizeErrorClick,setSizeErrorClick] = useState(false);

    let sizeArray = []

    const sizeSortArray = ['XS','S','M','L','XL']

    useEffect(()=>{
        axios.get(`/api/view-product/${product_code}/${onlyid}`).then(res=>{
        if(res.data.status === 200){
            setProduct(res.data.product);
            setSelectProduct(res.data.clickedproduct)
            setProductSize(res.data.size)
            setSize(res.data.clickedproduct[0].size)
            setTopImage(res.data.clickedproduct[0].topimage)
            // setSize(res.data.size[0].size)
            setColor(res.data.clickedproduct[0].color)
            setMount(true)
            window.scrollTo(0, 0);
        }else if(res.data.status === 404){
            navigate('/')
        }

        })
    },[id])

    useEffect(()=>{
        setProductSize(productSize.sort((a,b)=>{
        return sizeSortArray.indexOf(a.size) - sizeSortArray.indexOf(b.size)
        }));

        productSize.map(item=>{
        sizeArray.push(item.size)
        })
        let setsizeArray = Array.from(new Set(sizeArray))
        setSizeArray1(setsizeArray)
    },[productSize])


    const colorArray = []
    product.map(product=>{
        product.subproduct.map(item => {
        colorArray.push(item.color)
        })
    })
    const setcolorArray = Array.from(new Set(colorArray))

    const handleQuantity = (type) =>{
        if(!size){
        setSizeError(true)
        setSizeErrorClick(false)
        }else{
        if(type === 'dec'){
            quantity > 1 && setQuantity(quantity - 1)
        }else if(type === 'inc'){
            const selectquatity = selectProduct[0].sizequantityinfo.filter(item=>{
            return item.size === size
            })
            quantity < selectquatity[0].quantity && setQuantity(quantity + 1)
            // setQuantity(quantity + 1)
        }
        }
    }

    const addCart = (e) => {
        e.preventDefault();
        if(productQuantity !== 0){
            const product = selectProduct[0].sizequantityinfo.filter(prev=>prev.size === size);
            const oneproduct = {...product[0],quantity:quantity}
            if(product.length === 0){
            setSizeErrorClick(true)
            setSizeError(false)
            }else if(product.length !== 0){
            loginaxios.post(`api/add-cart`,oneproduct).then(res=>{
                if(res.data.status === 200){
                Swal.fire({
                    title: 'Success',
                    text: '商品をカートに追加しました',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                }else if(res.data.status === 400){
                Swal.fire({
                    title: 'Error',
                    text: res.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                }else if(res.data.status === 404){
                Swal.fire({
                    title: 'Error',
                    text: res.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                }else if(res.data.status === 401){
                Swal.fire({
                    title: 'Error',
                    text: res.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                }else if(res.data.status === 405){
                Swal.fire({
                    title: 'Error',
                    text: res.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                }
            })
            }
        }else if(productQuantity == 0){
            Swal.fire({
            title: 'Error',
            text: '申し訳ございません,その商品は売り切れとなっております',
            icon: 'error',
            confirmButtonText: 'OK'
            })
        }
    }

    const colorSelect = (c) => {
        setColor(c)
        const subproduct = product[0].subproduct
        setSelectProduct([...subproduct.filter(prev => prev.color === c)])
        const sizegroup = subproduct.filter(prev => prev.color === c)
        sizeArray = []
        const sizeSortgoup = sizegroup[0].sizequantityinfo.sort((a,b)=>{
        return sizeSortArray.indexOf(a.size) - sizeSortArray.indexOf(b.size)
        });
        sizeSortgoup.map(item=>{
        sizeArray.push(item.size)
        })
        let setsizeArray = Array.from(new Set(sizeArray))
        setSizeArray1(setsizeArray)
        setQuantity(1)
        setSize([...subproduct.filter(prev => prev.color === c)][0].size)
        setImageFocus('topimage')
        setTopImage(product[0].subproduct.filter(prev => prev.color === c)[0].topimage);
        setSize('')
        setProductQuantity()
        setSizeErrorClick(false)
    }

    const sizeSelect = (e) =>{
        e.preventDefault();
        setSize(e.target.value)

        setQuantity(1)
        let selectquantity = selectProduct[0].sizequantityinfo.filter(item=>{
        return item.size === e.target.value
        })
        if(e.target.value === ''){
        setProductQuantity()
        }else{
        setProductQuantity(selectquantity[0].quantity)
        setSizeErrorClick(false)
        }
        setSizeError(false)
    }


    const topImageHandler = (e) => {
        if(e.target.name === 'topimage'){
        setTopImage(selectProduct[0].topimage);
        setImageFocus('topimage')
        }
        if(e.target.name === 'image1'){
        setTopImage(selectProduct[0].image1)
        setImageFocus('image1');
        }
        if(e.target.name === 'image2'){
        setTopImage(selectProduct[0].image2);
        setImageFocus('image2');
        }
        if(e.target.name === 'image3'){
        setTopImage(selectProduct[0].image3);
        setImageFocus('image3');
        }
        if(e.target.name === 'image4'){
        setTopImage(selectProduct[0].image4);
        setImageFocus('image4');

        }
        if(e.target.name === 'image5'){
        setTopImage(selectProduct[0].image5);
        setImageFocus('image5');
        }
    }

  return (
    <div>
        <Navbar/>
        {mount && (
            <div className='productwrapper'>
                <div className='productimagecontainer'>
                    <img className='productimage' src={`http://localhost:8000/${topImage}`}/>
                    <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={30}
                    navigation={true}
                    // loop={true}
                    modules={[Navigation]}
                    className="swiper"
                    >

                        <SwiperSlide className="slideimage">
                        <img src={`http://localhost:8000/${selectProduct[0].topimage}`} alt='' name='topimage' className={imageFocus === 'topimage' ? 'focusimage' : ''} onClick={topImageHandler}/>
                        </SwiperSlide>

                        {selectProduct[0].image1 &&  <SwiperSlide className="slideimage">
                        <img src={`http://localhost:8000/${selectProduct[0].image1}`} alt='' name='image1' className={imageFocus === 'image1' ? 'focusimage' : ''} onClick={topImageHandler}/>
                        </SwiperSlide>}
                        {selectProduct[0].image2 &&  <SwiperSlide className="slideimage">
                        <img src={`http://localhost:8000/${selectProduct[0].image2}`} alt='' name='image2' className={imageFocus === 'image2' ? 'focusimage' : ''} onClick={topImageHandler}/>
                        </SwiperSlide>}
                        {selectProduct[0].image3 &&  <SwiperSlide className="slideimage">
                        <img src={`http://localhost:8000/${selectProduct[0].image3}`} alt='' name='image3' className={imageFocus === 'image3' ? 'focusimage' : ''} onClick={topImageHandler}/>
                        </SwiperSlide>}
                        {selectProduct[0].image4 &&  <SwiperSlide className="slideimage">
                        <img src={`http://localhost:8000/${selectProduct[0].image4}`} alt='' name='image4' className={imageFocus === 'image4' ? 'focusimage' : ''} onClick={topImageHandler}/>
                        </SwiperSlide>}
                        {selectProduct[0].image5 &&  <SwiperSlide className="slideimage">
                        <img src={`http://localhost:8000/${selectProduct[0].image5}`} alt='' name='image5' className={imageFocus === 'image5' ? 'focusimage' : ''} onClick={topImageHandler}/>
                        </SwiperSlide>}


                    </Swiper>
                </div>

                <div className='infocontainer'>

                    <h1 className='title'>{product[0].product_name}</h1>
                    <p className='description'>{product[0].description}</p>
                    <span className='price'>¥ {product[0].price.toLocaleString()}</span>
                    <div className='filtercontainer'>
                        <div className='filter'>
                            <span className='filtertitle'>Color</span>
                            {setcolorArray.map(c =>(
                                <div className='filtercolor' style={{backgroundColor:c}} color={c} key={c} onClick={()=>colorSelect(c)} />
                            ))}
                            <span className='filtertitle' style={{marginLeft:'50px'}}>Size</span>
                            <select className='filtersize' value={size} onChange={sizeSelect}>
                                <option value=''>サイズを選択</option>
                                {
                                    sizeArray1.map(s=>(
                                        <option key={s} >{s}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className='addcontainer'>
                        {productQuantity != 0 &&
                        <div className='amountcontainer'>
                        <RemoveIcon onClick={()=>handleQuantity('dec')}/>
                        <span className='amount'>{quantity}</span>
                        <AddIcon onClick={()=>handleQuantity('inc')}/>
                        {productQuantity < 10 &&
                        <p style={{marginLeft:'8px',color:'red',fontSize:'small'}}>残り{productQuantity}点</p>
                        }
                        </div>
                        }

                        {productQuantity == 0 &&
                        <div className='amountcontainer'>
                        <p style={{marginLeft:'8px',color:'red'}}>売り切れ</p>
                        </div>
                        }
                        <button className='cartbutton' onClick={addCart} style={{marginRight:'370px'}}>カートに追加</button>
                        {/* <p style={{color:'red',fontSize:'small'}}>サイズを選択してください</p> */}
                    </div>

                    {sizeError &&
                        <p style={{color:'red',fontSize:'small'}}>サイズを選択してください</p>
                    }
                    {sizeErrorClick &&
                    <p style={{color:'red',fontSize:'small',display:'flex',justifyContent:'flex-end',marginRight:'365px'}}>サイズを選択してください</p>
                    }
                </div>
            </div>
        )}

        <Newsletter/>
        <Footer/>
    </div>
  )
}

export default Product
