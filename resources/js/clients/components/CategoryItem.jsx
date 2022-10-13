import React from 'react'
import { Link } from 'react-router-dom'
import './CategoryItem.scss'

const CategoryItem = (props) => {
  return (
    <div className='categoryitemcontainer'>
        <Link to={`/products/${props.item.cat}`}>
            <img src={props.item.img} className='categoryitemimage'/>
            <div className='categoryiteminfo'>
                <h1 className='categoryitemtitle'>{props.item.title}</h1>
                <button className='categoryitembutton'>Shop Now</button>
            </div>
        </Link>

    </div>
  )
}

export default CategoryItem
