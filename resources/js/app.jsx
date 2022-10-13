// import '../css/app.css';
import "./bootstrap";
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./clients/pages/Home";
import { Provider } from "react-redux";
import store from "./clients/redux/store";
import './app.scss';

function App() {


    return (
        <React.StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Home/>}/>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
