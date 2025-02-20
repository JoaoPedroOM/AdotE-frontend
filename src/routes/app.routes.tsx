import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login"
import Cadastro from "@/pages/Cadastro";
import ResetPassword from "@/pages/ResetPassword";
import Footer from "@/components/global/Footer";
import Dashboard from "@/pages/Dashboard";

export function AppRoutes() {
  
    return (
      <Routes>
       <Route path="/" element={
          <>
            <App />
            <Footer/>
          </>
        }/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/reset" element={<ResetPassword/>}/> 
      </Routes>
    );
  }