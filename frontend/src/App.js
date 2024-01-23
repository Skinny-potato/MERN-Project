import './App.css';
import Header from "./component/layout/Header/Header"
import Footer from "./component/layout/Footer/Footer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import Home from "./component/Home/Home"
import ProductDetails from "./component/Product/ProductDetails"
import Products from "./component/Product/Products.jsx"
import Search from "./component/Product/Search.jsx"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.jsx"
import Profile from "./component/User/Profile.jsx"
import { useSelector } from 'react-redux';
import ProtectedRoute from "./component/Route/ProtectedRoute.jsx"
import UpdateProfile from "./component/User/UpdateProfile.jsx"
import UpdatePassword from "./component/User/UpdatePassword.jsx"
import ForgotPassword from "./component/User/ForgotPassword.jsx"
import ResetPassword from "./component/User/ResetPassword.jsx"
import Cart from "./component/Cart/Cart.jsx"
import Shipping from "./component/Cart/Shipping.jsx"
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx"
import Payment from "./component/Cart/Payment.jsx"
import OrderSuccess from "./component/Cart/OrderSuccess.jsx"
import MyOrders from "./component/Order/MyOrders.jsx";
import OrderDetails from "./component/Order/OrderDetails.jsx";
import axios from 'axios';
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.jsx";
import NewProduct from './component/Admin/NewProduct.jsx';
import UpdateProduct from './component/Admin/UpdateProduct.jsx';
import OrderList from './component/Admin/OrderList.jsx';
import ProcessOrder from './component/Admin/ProcessOrder.jsx';
import UserList from './component/Admin/UserList.jsx';
import UpdateUser from './component/Admin/UpdateUser.jsx';
import ProductReviews from './component/Admin/ProductReviews.jsx';
import NotFound from './component/layout/Notfound/NotFound.jsx';



function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("")

  const PaymentWrapper = () => (
    <Elements stripe={loadStripe(stripeApiKey)}>
      <Payment />
    </Elements>
  );

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey")
    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
    store.dispatch(loadUser());
    getStripeApiKey()

  }, [])
  //to prevent people from right clicking not being able to get inspect
  window.addEventListener("contextmenu", (e) => e.preventDefault());


  return (
    <BrowserRouter>
      <Header />
      {/* //{usage of the latest version of the node package....hence the code might be different from the real source code but the working is still same} */}
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path='/login' element={<LoginSignUp />} />


        {/* this routes are inside protection which means they need auth for access */}
        {/* --- */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          <Route path="/process/payment" element={<PaymentWrapper />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>


        {/* this set of protected routes are for admin */}
        <Route path='/' element={<ProtectedRoute isAdmin={true}/>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/reviews" element={<ProductReviews />} />
        </Route>
        {/* --- */}
        {/* this routes are inside protection which means they need auth for access */}


        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*"
          element={
            window.location.pathname === "/process/payment" ? null : <NotFound/>
          }
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
