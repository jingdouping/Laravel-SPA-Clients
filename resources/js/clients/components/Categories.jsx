import React from 'react'
import CategoryItem from './CategoryItem';
import MensImage from '../image/CategoryImage/austin-wade-iQn82USu8gs-unsplash.jpg';
import WomenImage from '../image/CategoryImage/joel-muniz-HvZDCuRnSaY-unsplash.jpg';
import KidsImage from '../image/CategoryImage/kiana-bosman-0pB01U2NDCQ-unsplash.jpg';
import './Categories.scss';

const Categories = (props) => {

    const categoryData = [
        {
          id: props.primarycategory[0].id,
          img:MensImage,
          title: props.primarycategory[0].primary_category_name + ' Style',
          cat:props.primarycategory[0].primary_category_name,
        },
        {
          id:props.primarycategory[1].id,
          img:WomenImage,
          title:props.primarycategory[1].primary_category_name + ' Style',
          cat:props.primarycategory[1].primary_category_name,
        },
        {
          id:props.primarycategory[2].id,
          img:KidsImage,
          title:props.primarycategory[2].primary_category_name + ' Style',
          cat:props.primarycategory[2].primary_category_name,
        },
      ]


      const tabHandler = (e) => {
        document.getElementsByClassName('is-active')[0].classList.remove('is-active');
        e.target.classList.add('is-active');
        document.getElementsByClassName('is-show')[0].classList.remove('is-show');
        const tabs = document.getElementsByClassName('tab');
        const arrayTabs = Array.prototype.slice.call(tabs);
            const index = arrayTabs.indexOf(e.target);
        document.getElementsByClassName('panel')[index].classList.add('is-show');
      }

  return (
    <>
        <h1 className='paragraph'>Our Products</h1>
        <div className='tabpanel'>
            <ul className='tabgroup'>
                <li className='tab is-active' onClick={tabHandler}>Mens</li>
                <li className='tab' onClick={tabHandler}>Women</li>
                <li className='tab' onClick={tabHandler}>Kids</li>
            </ul>
            <div className='panelgroup'>
                <div className='panel is-show'>
                {props.categoryProducts0.map((item,id)=>{
                    return (
                        <Product item={item} id={id}/>
                    )
                })}
                </div>
                <div className='panel'>
                {props.categoryProducts1.map((item,id)=>{
                    return (
                        <Product item={item} id={id}/>
                    )
                })}
                </div>
                <div className='panel'>
                {props.categoryProducts2.map((item,id)=>{
                    return (
                        <Product item={item} id={id}/>
                    )
                })}
                </div>
            </div>
        </div>
        <div className='categorycontainer'>
            {categoryData.map((item,id)=>(
                <CategoryItem item={item} key={id} />
            ))}
        </div>
    </>
  )
}

export default Categories
