import React from 'react'
import { Link } from 'react-router-dom';

const Product = (props) => {
    const quantity = props.item.sizequantityinfo.every(item=>{
        return item.quantity == 0
    })

    window.addEventListener("scroll", ()=>{
    let positionY = window.scrollY;
    localStorage.setItem('scroll',positionY);
    });

  return (
    <div className='catproductscontainer' key={props.id}>
        <div>
            <Link to={`/product/${props.item.product.product_code}/${props.item.id}`}>
                <div className='catproductsimagewrapper'>
                    <img className='catproductsimage' src={`http://127.0.0.1:5173/${props.item.topimage}`}></img>
                </div>
            </Link>
            {quantity ? <h3 style={{display:'flex',justifyContent:'center',marginTop:'4px',color:'red'}}>売り切れ</h3> :
            <>
            <h3 style={{display:'flex',justifyContent:'center',marginTop:'4px'}}>{props.item.product.product_name}</h3>
            <h4 style={{display:'flex',justifyContent:'center',fontWeight:'300'}}>¥{props.item.product.price.toLocaleString()}</h4>
            </>
            }

        </div>

    </div>
  )
}

export default Product
