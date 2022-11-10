import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { adminloginaxios } from '../../../app'
import Sidebar from '../../components/sidebar/Sidebar'
import './addSize.scss'

const AddSize = (props) => {
  const navigate = useNavigate()
  let {id,subproduct_id} = useParams();
  const [error,setError] = useState([]);
  const [input,setInput] = useState({
    size:'',
    quantity:'',
    // is_selling:'1',
  })


  useEffect(()=>{
    adminloginaxios.get(`api/edit-size/${id}`).then(res=>{
      if(res.data.status === 200){
        setInput({...input,size:res.data.size[0].size,quantity:res.data.size[0].quantity,is_selling:res.data.size[0].is_selling})
      }
    })
  },[])


  const handleInput = (e) => {
    // e.persist();
    setInput({...input,[e.target.name]:e.target.value})
  }

  const inputSubmit = (e) => {
    e.preventDefault();
    adminloginaxios.post(`api/update-size/${id}/${subproduct_id}`,input).then(res=>{
      if(res.data.status === 200){
        document.getElementById('FORM').reset();
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        navigate(`/admin/subproducts/viewsize/${subproduct_id}`)
      }else if(res.data.status === 422){
        setError(res.data.errors);
      }
    })
  }

  return (
    <div className='new'>
      <Sidebar/>
      <div className='newContainer'>
        <div className='top'>
          <h1>{props.title}</h1>
        </div>
        <div className='bottom'>

          <div className='right'>
            <form id='FORM' onSubmit={inputSubmit}>
              <div className='formInput'>
                <label>Size</label>
                <input type='text' placeholder='Size' value={input.size} onChange={handleInput} name='size' />
                <small style={{color:'red'}}>{error.size}</small>
              </div>
              <div className='formInput'>
                <label>数量</label>
                <input type='number' placeholder='数量' value={input.quantity} onChange={handleInput} name='quantity' />
                <small style={{color:'red'}}>{error.quantity}</small>
              </div>
              {/* <div className='formInput'>
                <label style={{marginBottom:'4px'}}>販売状態</label>
                <select name='is_selling' value={input.is_selling} onChange={handleInput}>
                  <option value='1'>販売中</option>
                  <option value='0'>販売停止</option>
                </select>
                <small style={{color:'red'}}>{error.is_selling}</small>
              </div> */}
              <button style={{height:'35px',marginTop:'auto'}}>送信</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AddSize
