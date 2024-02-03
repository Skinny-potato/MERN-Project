import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2';
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllUsers } from "../../actions/userAction.jsx";
import MetaData from "../layout/MetaData.js";
import { getAllOrders } from "../../actions/orderAction.js";
import {
  // getOrderDetails,
  // clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import axios from "axios"
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)




const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);

  const { orders } = useSelector((state) => state.allOrders);

  const { users } = useSelector((state) => state.allUsers);

  const timeStampGenerator = (date)=>{
    const presentTimeStamp = new Date().getTime()

    const originalDate = new Date(date);
    let newDate = new Date(originalDate);
    newDate.setDate(originalDate.getDate() + 7);
    newDate=newDate.toISOString()
    
    const sevenDaysTimeStamp = new Date(newDate).getTime()
    return {presentTimeStamp,sevenDaysTimeStamp}
  }
  const checkTheDeliveryStatus = async()=>{
    const { data } = await axios.get("/api/v1/admin/orders");
    let orders = data.orders
    orders.forEach((order)=>{
      let orderTimes = timeStampGenerator(order.CreatedAt)

      if (orderTimes.presentTimeStamp >= orderTimes.sevenDaysTimeStamp && order.orderStatus!=="Delivered"){
        console.log("your order should be delivered")
        dispatch(updateOrder(order._id, {"status":"Delivered"}));
      }

    })


  }

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });
  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
    checkTheDeliveryStatus()
  }, [dispatch, checkTheDeliveryStatus]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  totalAmount = totalAmount.toFixed(2)

  //line chart
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  //donout chart
  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
