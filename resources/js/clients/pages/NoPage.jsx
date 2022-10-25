import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Newsletter from '../components/Newsletter'
import './NoPage.scss';

const NoPage = () => {
  return (
    <div>
        <Navbar/>
        <div className='nopage'>
            <h1>ページが見つかりませんでした</h1>
        </div>
        <Newsletter/>
        <Footer/>

    </div>
  )
}

export default NoPage
