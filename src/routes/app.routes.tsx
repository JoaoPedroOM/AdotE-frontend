import { Routes, Route } from "react-router-dom";
import App from "../App";
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
      </Routes>
    );
  }