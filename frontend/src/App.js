
//import logo from "./logo.svg";
import "./App.css";

import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Home from "./pages/admin pages/Home/Home";
import Customer from "./pages/admin pages/Customer/Customer";
import Device from "./pages/admin pages/Device/Device";
import Employee from "./pages/admin pages/Employee/Employee";
import Payment from "./pages/admin pages/Payment/Payment";
import Selling from "./pages/admin pages/Selling/Selling";
import CustomerHome from "./pages/customer pages/CustomerHome/CustomerHome";
import CustomerPurchase from "./pages/customer pages/CustomerPurchase/CustomerPurchase";
import CustomerDevice from "./pages/customer pages/CustomerDevice/CustomerDevice";
import EHome from "./pages/employee pages/EHome/EHome";
import EDevice from "./pages/employee pages/EDevice/EDevice";
import EPayment from "./pages/employee pages/EPayment/EPayment";
import ESelling from "./pages/employee pages/ESelling/ESelling";
import { Login } from "./pages/Login/Login";
import {Forget_password}  from "./pages/Login/Forget_password";
import CustomerList from "./pages/admin pages/List/customerList";
import DeviceList from "./pages/admin pages/List/DeviceList"
import EmployeeList from"./pages/admin pages/List/EmployeeList"
import PaymentList from "./pages/admin pages/List/PaymentList"

function App() {
  return (
    <div>
      {/* <UpdateItems/> */}

      <Routes>
     
      <Route exact path="/" element={<Login/>}/>
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/customer" element={<Customer/>} />
        <Route exact path="/CustomerList" element={<CustomerList/>} />
        <Route exact path="/DeviceList" element={<DeviceList/>} />
        <Route exact path="/EmployeeList" element={<EmployeeList/>} />
        <Route exact path="/PaymentList" element={<PaymentList/>} />
        <Route exact path="/device" element={<Device/>} />
        <Route exact path="/employee" element={<Employee/>} />
        <Route exact path="/payment" element={<Payment/>} />
        <Route exact path="/selling" element={<Selling/>} />

        <Route exact path="/ehome" element={<EHome/>} />
        <Route exact path="/edevice" element={<EDevice/>} />
        <Route exact path="/epayment" element={<EPayment/>} />
        <Route exact path="/eselling" element={<ESelling/>} />
        <Route exact path="/customerhome" element={<CustomerHome/>} />
        <Route exact path="/customerpurchase/:id" element={<CustomerPurchase/>} />
        <Route exact path="/customerdevice" element={<CustomerDevice/>} />
      </Routes>
    </div>
  );
}

export default App;
