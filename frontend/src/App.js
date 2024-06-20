import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/admin pages/Home/Home";
import Customer from "./pages/admin pages/Customer/Customer";
import Device from "./pages/admin pages/Device/Device";
import Employee from "./pages/admin pages/Employee/Employee";
import Payment from "./pages/admin pages/Payment/Payment";
import Selling from "./pages/admin pages/Selling/Selling";
import CustomerHome from "./pages/customer pages/CustomerHome/CustomerHome";
import CustomerPurchase from "./pages/customer pages/CustomerPurchase/CustomerPurchase";
import CustomerDevice from "./pages/customer pages/CustomerDevice/CustomerDevice";
import CustomerProfile from './pages/customer pages/CustomerProfile/CustomerProfile';
import CustomerUpdate from './pages/customer pages/CustomerProfile/CustomerUpdate';
import CustomerPassword from './pages/customer pages/CustomerProfile/CustomerPassword';
import EHome from "./pages/employee pages/EHome/EHome";
import EDevice from "./pages/employee pages/EDevice/EDevice";
import EPayment from "./pages/employee pages/EPayment/EPayment";
import ESelling from "./pages/employee pages/ESelling/ESelling";
import Login from "./pages/Login/Login";
import CustomerList from "./pages/admin pages/List/customerList";
import DeviceList from "./pages/admin pages/List/DeviceList"
import EmployeeList from "./pages/admin pages/List/EmployeeList"
import PaymentList from "./pages/admin pages/List/PaymentList"
import UpdateCustomer from "./pages/admin pages/admin update pages/UpdateCustomer";
import UpdateDevice from "./pages/admin pages/admin update pages/UpdateDevice";
import UpdateEmployee from "./pages/admin pages/admin update pages/UpdateEmployee";
import EUpdateDevices from "./pages/employee pages/employee update pages/EUpdateDevices";
import Report from "./pages/admin pages/List/Report";
import ProtectedRoute from "./pages/Login/ProtectedRoute";
import Forget_password from './pages/Login/Forget_password';
import Resetpassword from './pages/Login/Resetpassword';

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route exact path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
        <Route exact path="/CustomerList" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
        <Route exact path="/DeviceList" element={<ProtectedRoute><DeviceList /></ProtectedRoute>} />
        <Route exact path="/EmployeeList" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route exact path="/PaymentList" element={<ProtectedRoute><PaymentList /></ProtectedRoute>} />
        <Route exact path="/device" element={<ProtectedRoute><Device /></ProtectedRoute>} />
        <Route exact path="/employee" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
        <Route exact path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route exact path="/selling" element={<ProtectedRoute><Selling /></ProtectedRoute>} />
        <Route exact path="/ehome" element={<ProtectedRoute><EHome /></ProtectedRoute>} />
        <Route exact path="/edevice" element={<ProtectedRoute><EDevice /></ProtectedRoute>} />
        <Route exact path="/epayment" element={<ProtectedRoute><EPayment /></ProtectedRoute>} />
        <Route exact path="/eselling" element={<ProtectedRoute><ESelling /></ProtectedRoute>} />
        <Route exact path="/customerhome" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
        <Route exact path="/customerpurchase/:id" element={<ProtectedRoute><CustomerPurchase /></ProtectedRoute>} />
        <Route exact path="/customerdevice" element={<ProtectedRoute><CustomerDevice /></ProtectedRoute>} />
        <Route exact path="/customerprofile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
        <Route exact path="/customerupdate" element={<ProtectedRoute><CustomerUpdate /></ProtectedRoute>} />
        <Route exact path="/customerpassword" element={<ProtectedRoute><CustomerPassword /></ProtectedRoute>} />
        <Route exact path="customer/updatecustomer/:id" element={<ProtectedRoute><UpdateCustomer /></ProtectedRoute>} />
        <Route exact path="device/updatedevice/:id" element={<ProtectedRoute><UpdateDevice /></ProtectedRoute>} />
        <Route exact path="employee/updateemployee/:id" element={<ProtectedRoute><UpdateEmployee /></ProtectedRoute>} />
        <Route exact path="edevice/eupdatedevice/:id" element={<ProtectedRoute><EUpdateDevices /></ProtectedRoute>} />
        <Route exact path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route exact path="/forget_password" element={<Forget_password/>} />
        <Route exact path="/Reset_password" element={<Resetpassword/>} />
      </Routes>
    </div>
  );
}

export default App;
