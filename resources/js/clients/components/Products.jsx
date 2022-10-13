import { Pagination, Stack } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Product from './Product';
import './Products.scss';

const Products = (props) => {
    const [products,setProducts] = useState([]);
    const [dispalayProducts,setDisplayProducts] = useState([]);
    const [filteredProducts,setFilteredProducts] = useState([]);
    const [page,setPage] = useState(1)
    const [pageCount,setPageCount] = useState()
    const navigate = useNavigate();

    let {cat_id} = useParams();

    const displayCount = 8

    useEffect(()=>{
      if(cat_id){
        axios.get(`/api/product/${cat_id}`).then(res=>{
          if(res.data.status === 200){
            setProducts(res.data.products);
            setPageCount(Math.ceil(res.data.products.length/displayCount))
            setDisplayProducts(res.data.products.slice(((page - 1) * displayCount),page * displayCount))
          }else if(res.data.status === 404){
            navigate('/')
          }
        });
      }else{
        setPageCount(Math.ceil(props.products.length/displayCount))
        setDisplayProducts(props.products.slice(((page - 1) * displayCount),page * displayCount))
      }
    },[props.cat,props.products])


    useEffect(()=>{
      props.cat && setFilteredProducts(
        products.filter(item=> {
          return Object.entries(props.filters).every(([key,value])=>{
            return item[key].includes(value)
          })
        })
      );
    },[products,props.cat,props.filters])


    const pageHandler = (e,index) => {
      setPage(index)
      setDisplayProducts(props.products.slice(((index -1) * displayCount),index * displayCount))
      let positionY = localStorage.getItem('scroll')
      window.scrollTo(0,positionY);
    }

  return (
      <>
        <div className='productscontainer'>
            {cat_id ? filteredProducts.map(item=>(
            <Product item={item} key={item.id}/>
        )): dispalayProducts.map(item=>(
            <Product item={item} key={item.id}/>
        ))}
        </div>
        <div className='paginationcontainer'>
            <Stack spacing={1}>
                <Pagination count={pageCount} onChange={(e,index)=>pageHandler(e,index)} page={page} size="small"/>
            </Stack>
        </div>
    </>
  )
}

export default Products
