import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Cookies from "js-cookie";
import { getTokenPayload } from "@/utils/authUtils";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "../components/ui/sonner"

export function Routes() {
  const { islogin } = useAuthStore();
  const queryClient = new QueryClient();

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const userData = getTokenPayload(token);
      islogin(token, {
        organizacao_id: userData.organizacao_id,
        organizacao_name: userData.organizacao_name,
      });
    }
  }, [islogin]);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <Toaster />    
      </QueryClientProvider>
    </BrowserRouter>
  );
}
