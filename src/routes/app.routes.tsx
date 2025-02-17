import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login"
import Cadastro from "@/pages/Cadastro";
import Footer from "@/components/global/Footer";

export function AppRoutes() {
    return (
      <Routes>
       <Route path="/" element={
          <>
            <App />
            <Footer/>
          </>
        }/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/cadastro" element={<Cadastro/>}/>
      </Routes>
    );
  }