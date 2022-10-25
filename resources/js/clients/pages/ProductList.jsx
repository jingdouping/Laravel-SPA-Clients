import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Newsletter from '../components/Newsletter'
import Product from '../components/Product'
import { Search } from '@mui/icons-material'
import { Pagination, Stack } from '@mui/material'
import './ProductList.scss'

const ProductList = () => {

    const location = useLocation();
    const cat = location.pathname.split('/')[2];
    const [sort,setSort] = useState('newest');
    const [primaryCategory,setPrimaryCategory] = useState([])
    const [catProduct,setCatProduct] = useState([])

    const [selectedPrimaryCategory,setSelectedPrimaryCategory] = useState(cat)
    const [selectedSecondaryCategory,setSelectedSecondaryCategory] = useState('All')
    const [allProduct,setAllProduct] = useState([])
    const [search,setSearch] = useState('')
    const [displayProducts,setDisplayProducts] = useState([]);
    const [searchProducts,setSearchProducts] = useState([]);
    const [page,setPage] = useState(1)
    const [pageCount,setPageCount] = useState()

    const [filterProducts,setFilterProducts] = useState([])
    const [sortProducts,setSortProducts] = useState([])
    const [allSecCat,setAllSecCat] = useState([])
    const [secCat,setSecCat] = useState([])

    const displayCount = 8

    let primaryArray = ['All',]

    primaryCategory.map(item=>{
      return primaryArray.push(item.primary_category_name)
    })

    useEffect(()=>{
      window.scrollTo(0, 0);
      axios.get(`/api/view-categoryproduct/${cat}`).then(res=>{
        if(res.data.status === 200){
          setPrimaryCategory(res.data.primary_category)
          setCatProduct(res.data.categoryproducts)
          setAllProduct(res.data.reversesubproducts)

          const secondarycatArray = []
          res.data.secondary_category.map(item=>{
            secondarycatArray.push(item.secondary_category_name)
          })
          const secAllCat = Array.from(new Set(secondarycatArray))
          setAllSecCat(secAllCat)
          // setAllSecCat(res.data.secondary_category)

          const selectseccatArray = []
          res.data.categoryproducts[0].secondarycategory.map(item=>{
            selectseccatArray.push(item.secondary_category_name)
          })
          setSecCat(selectseccatArray)
          // setSecCat(res.data.selectsecondarycat)

          let subproductArray = []
          res.data.reversesubproducts.forEach(sub=>{
            if(sub.product.secondarycategory.primarycategory.primary_category_name === cat){
              subproductArray.push(sub)
            }else{
              return
            }
          })
          setFilterProducts(subproductArray)
          setSearchProducts(subproductArray)

        }
      })

    },[])


    useEffect(()=>{
      setDisplayProducts(sortProducts.slice(((page - 1) * displayCount),page * displayCount))
      setPageCount(Math.ceil(sortProducts.length/displayCount))
      // setSearchProducts(sortProducts)
    },[sortProducts,page])

    useEffect(()=>{
      if(search !== ''){
        if(sort === 'newest'){
          setSortProducts(searchProducts.slice().sort((a,b)=>new Date(b.created_at) - new Date(a.created_at)))
        }else if(sort === 'oldest'){
          setSortProducts(searchProducts.slice().sort((a,b)=>new Date(a.created_at) - new Date(b.created_at)))
        }else if(sort === 'asc'){
          setSortProducts(searchProducts.slice().sort((a,b)=>a.product.price - b.product.price))
        }else{
          setSortProducts(searchProducts.slice().sort((a,b)=>b.product.price - a.product.price))
        }
      }else{
        if(sort === 'newest'){
          setSortProducts(filterProducts.slice().sort((a,b)=>new Date(b.created_at) - new Date(a.created_at)))
        }else if(sort === 'oldest'){
          setSortProducts(filterProducts.slice().sort((a,b)=>new Date(a.created_at) - new Date(b.created_at)))
        }else if(sort === 'asc'){
          setSortProducts(filterProducts.slice().sort((a,b)=>a.product.price - b.product.price))
        }else{
          setSortProducts(filterProducts.slice().sort((a,b)=>b.product.price - a.product.price))
        }
      }
      setPage(1)
    },[sort,filterProducts,searchProducts])

    useEffect(()=>{
      if(selectedPrimaryCategory === 'All'){
        setSecCat(allSecCat)
        if(selectedSecondaryCategory === 'All'){
          let subproductArray = []
          allProduct.forEach(sub=>{
            subproductArray.push(sub)
          })
          setFilterProducts(subproductArray)
        }else if(selectedSecondaryCategory !== 'All'){
          let subproductArray = []
          allProduct.forEach(sub=>{
            if(sub.product.secondarycategory.secondary_category_name === selectedSecondaryCategory){
              subproductArray.push(sub)
            }else{
              return
            }
          })

          setFilterProducts(subproductArray)
        }
      }else if(selectedPrimaryCategory !== 'All'){
        const selectseccatArray = []
        catProduct.filter(item=>{
           if(item.primary_category_name === selectedPrimaryCategory){
             item.secondarycategory.map(item=>{
               selectseccatArray.push(item.secondary_category_name)
             })
           }
        })
        setSecCat(selectseccatArray)
        if(selectedSecondaryCategory === 'All'){
          let subproductArray = []
          allProduct.forEach(sub=>{
            if(sub.product.secondarycategory.primarycategory.primary_category_name === selectedPrimaryCategory){
              subproductArray.push(sub)
            }else{
              return
            }
          })
          setFilterProducts(subproductArray)
        }else if(selectedSecondaryCategory !== 'All'){
          let subproductArray = []
          allProduct.forEach(sub=>{
            if(sub.product.secondarycategory.primarycategory.primary_category_name === selectedPrimaryCategory){
              if(sub.product.secondarycategory.secondary_category_name === selectedSecondaryCategory){
                subproductArray.push(sub)
              }else{
                return
              }
            }else{
              return
            }
          })
          if(subproductArray.length === 0){
            allProduct.forEach(item=>{
              if(item.product.secondarycategory.primarycategory.primary_category_name === selectedPrimaryCategory){
                subproductArray.push(item)
              }
            })
          }
          setFilterProducts(subproductArray)
        }
      }
    },[selectedPrimaryCategory,selectedSecondaryCategory])

    useEffect(()=>{
      if(filterProducts.find(item=>{
          const escapedText = search.toLowerCase()
          return new RegExp(escapedText).test(item.product.product_name.toLowerCase());
        })){
        setSearchProducts(filterProducts.filter(item=>{
          const escapedText = search.toLowerCase()
          return new RegExp(escapedText).test(item.product.product_name.toLowerCase());
        }))
      }else{
        setSearchProducts([])
      }
    },[search])

    const handleFilters = (e) =>{
      if(e.target.name === 'primary_category_name'){
        setSelectedPrimaryCategory(e.target.value)
        setSelectedSecondaryCategory('All')
      }else if(e.target.name === 'secondary_category_name'){
        setSelectedSecondaryCategory(e.target.value)
      }
      document.getElementById("search").value='';
      setSearch('')
    }

    const searchProduct = (e) =>{
      setSearch(e.target.value)
    }

    const pageHandler = (e,index) => {
      setPage(index)
      let positionY = localStorage.getItem('scroll')
      window.scrollTo(0,positionY);
    }


  return (
    <div>
        <Navbar/>
        <h1 className='prductstitle'>全商品一覧</h1>
        <div className='filtercontainer'>
            <div className='filter'>
                <span className='filtertext'>Filter Products:</span>
                <select className='filterselect' name='primary_category_name' onChange={handleFilters} value={selectedPrimaryCategory}>
                    <option disabled>第一カテゴリーを選択</option>
                    {
                        primaryArray.map(item=>{
                           return <option key={item.toString()} value={item} >{item}</option>
                        })
                    }
                </select>
                <select className='filterselect' name='secondary_category_name' onChange={handleFilters} value={selectedSecondaryCategory}>
                    <option disabled>第二カテゴリーを選択</option>
                    <option value='All'>All</option>
                    {secCat.map((item,key)=>{
                    return (
                        <option key={key}>{item}</option>
                    )
                    })}
                </select>
            </div>
            <div className='filter'>
                <span className='filtertext'>Sort Products:</span>
                <select className='filterselect'  onChange={e=>setSort(e.target.value)} >
                    {/* <Option value='sort'>Sort</Option> */}
                    <option value='newest'>新しい順</option>
                    <option value='oldest'>古い順</option>
                    <option value='asc'>価格 (低い順)</option>
                    <option value='desc'>価格 (高い順)</option>
                </select>
            </div>
        </div>

        <div className='filter'>
            <span className='filtertext'>Find Products:</span>
            <div className='searchcontainer'>
                <input id='search' placeholder='search' onChange={searchProduct}/>
                <Search style={{color:'gray',fontSize:16,}}/>
            </div>
        </div>

        <div className='productcontainer'>
            {displayProducts.map(item=>{
                return <Product item={item} key={item.id}/>
            })}
        </div>

        <div className='paginationcontainer'>
            <Stack spacing={1}>
                <Pagination count={pageCount} onChange={(e,index)=>pageHandler(e,index)} page={page} size="small"/>
            </Stack>
        </div>

        <Newsletter/>
        <Footer/>

    </div>
  )
}

export default ProductList
