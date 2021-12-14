import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Selector } from './pages/Selector/Selector';
import { Menu } from './pages/Menu/Menu';
import { OrderPage } from './pages/OrderClient/OrderPage';
import { OrderList } from './pages/OrderList/OrderList';
import { Success } from './pages/Success/Success';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Selector/>} />
          <Route path="menu" element={<Menu/>}/>
          <Route path="order"element={<OrderPage/>}/>
          <Route path="ordersRistoratore" element={<OrderList/>}/>
          <Route path="success" element={<Success/>}/>
          <Route path="*" element={<Selector/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
