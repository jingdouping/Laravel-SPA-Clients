import React from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import './Footer.scss';

const Footer = () => {
  return (
    <div className='footercontainer'>
        <div className='footerleft'>
            <h1 className='footerlogo'>FashionSite</h1>
            <p className='footerdesc'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
            </p>

        </div>

        <div className='footerright'>
            <h3 className='footertitle'>Contact</h3>
            <div className='contactitem'>
            <LocationOnIcon  style={{marginRight:"10px"}}/>東京都 渋谷区 南青山 2-34-11
            </div>
            <div className='contactitem'>
            <LocalPhoneIcon style={{marginRight:"10px"}}/>0320 2658 5288
            </div>
            <div className='contactitem'>
            <EmailIcon style={{marginRight:"10px"}}/>contact@contact.dev
            </div>
            <div className='socialcontainer'>
                <div style={{backgroundColor:'#55ACEE'}} className='socialicon'>
                    <TwitterIcon/>
                </div>
                <div style={{backgroundColor:'#E4405F'}} className='socialicon'>
                    <InstagramIcon/>
                </div>
                <div style={{backgroundColor:'#385999'}} className='socialicon' >
                    <FacebookIcon/>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Footer
