import React from 'react'
import ReactDOM from "react-dom/client";
import "./bootstrap";
import './app.scss';

function Ordermail(){
    const element = document.getElementById('ordermail');
    let cartsList = JSON.parse(element.dataset.orderitem);
    let username = JSON.parse(element.dataset.username);

  return (
    <>
        <p>{username}様 ご注文ありがとうございました。</p>
    </>
  )
}

const ordermail = ReactDOM.createRoot(document.getElementById("ordermail"));
ordermail.render(
    <React.StrictMode>
        <Ordermail/>
    </React.StrictMode>
)
