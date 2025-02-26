import {
  cadastroService,
  loginService,
  resetPasswordService,
} from "@/services/authService";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/useAuthStore";
import { getTokenPayload } from "@/utils/authUtils";

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const { islogin, islogout } = useAuthStore();

  useEffect(() => {
    const savedToken = Cookies.get("authToken");
    if (savedToken) {
      const userData = getTokenPayload(savedToken);
      islogin(savedToken, {
        organizacao_id: userData.organizacao_id,
        organizacao_name: userData.organizacao_name,
      });
    }
  }, [islogin]);

  const login = async (email: string, senha: string) => {
    try {
      const data = await loginService(email, senha);

      Cookies.set("authToken", data.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      const userData = getTokenPayload(data.token);
      islogin(data.token, {
        organizacao_id: userData.organizacao_id,
        organizacao_name: userData.organizacao_name,
      });
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
    senha: string,
    nome: string,
    cnpj: string,
    cep: string,
    numero: string
  ) => {
    try {
      await cadastroService(email, senha, nome, cnpj, cep, numero);
      await login(email, senha);
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
