import Sidebar from "../../components/sidebar/Sidebar";
import "./newCategory.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditFirstCategory(props) {
  const navigate = useNavigate()

  const [category,setCategory] = useState([])
  const [error,setError] = useState([]);


  let {categoryid} = useParams();
  useEffect(()=>{
    axios.get(`/api/edit-firstcategory/${categoryid}`).then(res=>{
      if(res.data.status === 200){
        setCategory(res.data.primary_category);
      }else if(res.data.status == 404){

      }
    });

  },[])

  const handleInput = (e) => {
    // e.persist();
    setCategory({...category,[e.target.name]:e.target.value})
  }

  const updateCategory = (e) => {
    e.preventDefault()
    axios.post(`/api/update-firstcategory/${categoryid}`,category).then(res => {
      if(res.data.status === 200){
        document.getElementById('CATEGORY_FORM').reset();
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        navigate('/admin/firstcategories')
      }else if(res.data.status === 422){
        setError(res.data.errors);
      }
    });
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
            <form onSubmit={updateCategory} id='CATEGORY_FORM'>

              <div className='formInput'>
                <label>第一カテゴリー</label>
                <input type='text' placeholder='第一カテゴリー' name='primary_category_name' onChange={handleInput} value={category.primary_category_name} />
                <small style={{color:'red'}}>{error.primary_category_name}</small>
              </div>
              <button style={{height:'35px',marginTop:'auto'}}>送信</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
