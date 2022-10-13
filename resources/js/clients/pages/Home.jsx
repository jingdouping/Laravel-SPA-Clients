import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Categories from '../components/Categories'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Newsletter from '../components/Newsletter'
import Products from '../components/Products'
import Slider from '../components/Slider'

const Home = () => {
  const [products,setProducts] = useState([])
  const [categoryProducts0,setCategoryProducts0] = useState([])
  const [categoryProducts1,setCategoryProducts1] = useState([])
  const [categoryProducts2,setCategoryProducts2] = useState([])
  const [primarycategory,setPrimarycategory] = useState([
    {id:'',primary_category_name:'',secondarycategory:''},
    {id:'',primary_category_name:'',secondarycategory:''},
    {id:'',primary_category_name:'',secondarycategory:''},
  ])

//   useEffect(()=>{
//     axios.get(`/api/view-webproduct`).then(res=>{
//       if(res.data.status === 200){
//         setProducts(res.data.reversesubproducts);
//         setCategoryProducts0(res.data.categoryproducts0)
//         setCategoryProducts1(res.data.categoryproducts1)
//         setCategoryProducts2(res.data.categoryproducts2)
//         setPrimarycategory(res.data.primary_category)
//       }
//     })
//   },[])

  return (
    <div>
      <Navbar/>
      <Slider/>
      <Categories primarycategory={primarycategory} categoryProducts0={categoryProducts0} categoryProducts1={categoryProducts1} categoryProducts2={categoryProducts2}/>
      <Products products={products}/>
      <Newsletter/>
      <Footer/>
    </div>
  )
}

export default Home
