import {
  cadastroService,
  loginService,
  resetPasswordService,
} from "@/services/authService";
import { useState } from "react";
import Cookies from "js-cookie";

export const useAuth = () => {
  const [authToken, setAuthToken] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginService(email, password);

      Cookies.set("authToken", data.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      setAuthToken(data.token);
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
    setAuthToken(null);
    console.log("Logout realizado com sucesso!");
  };

  return { authToken, login, cadastroAndLogin, resetPassword, logout, error };
};
