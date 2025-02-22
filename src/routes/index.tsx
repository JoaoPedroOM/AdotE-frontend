import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Cookies from "js-cookie";

export function Routes() {
  const { islogin } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      islogin(token); 
    }
  }, [islogin]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
