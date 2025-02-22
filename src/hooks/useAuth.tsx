import {
  cadastroService,
  loginService,
  resetPasswordService,
} from "@/services/authService";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const { islogin, islogout } = useAuthStore();

  useEffect(() => {
    const savedToken = Cookies.get('authToken');
    if (savedToken) {
      islogin(savedToken); 
    }
  }, [islogin]);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginService(email, password);

      Cookies.set("authToken", data.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      islogin(data.token);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Erro ao fazer login. Tente novamente.";
      setError(errorMessage);
      throw err;
    }
  };

  const cadastroAndLogin = async (
    email: string,
    password: string,
    role: string,
    name: string,
    cnpj: string,
    postalCode: string,
    phoneNumber: string
  ) => {
    try {
      await cadastroService(
        email,
        password,
        role,
        name,
        cnpj,
        postalCode,
        phoneNumber
      );
      await login(email, password);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      setError(errorMessage);
    }
  };

  const resetPassword = async (email: string, password: string) => {
    try {
      await resetPasswordService(email, password);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Erro ao resetar senha. Tente novamente.";
      setError(errorMessage);
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    islogout();
    console.log("Logout realizado com sucesso!");
  };

  return { login, cadastroAndLogin, resetPassword, logout, error };
};
