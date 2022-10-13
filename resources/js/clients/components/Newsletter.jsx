import React from 'react'
import SendIcon from '@mui/icons-material/Send';
import './Newsletter.scss';

const Newsletter = () => {
  return (
    <div className='newslettercontainer'>
        <h1 className='newslettertitle'>Newsletter</h1>
        <div className='newsletterdescription'>登録して最新の商品情報を受け取りましょう</div>
        <div className='newsletterinputontainer'>
            <input className='newsletterinput' placeholder='Email'/>
            <button className='newsletterbutton'>
                <SendIcon/>
            </button>
        </div>

    </div>
  )
}

export default Newsletter
