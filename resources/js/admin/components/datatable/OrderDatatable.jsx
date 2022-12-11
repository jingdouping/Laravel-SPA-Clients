import React, { useEffect, useState } from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { ordersColumns,userRows } from '../../datatablesource';
import { Link } from 'react-router-dom';
import { adminloginaxios } from '../../../app';

const OrderDatatable = () => {
  const [data,setData] = useState(userRows)
  const [orders,setOrders] = useState([])


  useEffect(()=>{
    adminloginaxios.get('/api/view-orders').then(res=>{
      if(res.status === 200){
        setOrders(res.data.orders)
      }
    });
  },[]);



  return (
    <div className='datatable'>

      <DataGrid
      className='datagrid'
        rows={orders}
        columns={ordersColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

    </div>
  )
}

export default OrderDatatable
