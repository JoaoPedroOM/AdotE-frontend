import {
  cadastroService,
  loginService,
  sendCodigoService,
  verifyCodigoService,
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
    nome: string,
    numero: string,
    cnpj: string,
    endereco: any,
    email: string,
    senha: string
  ) => {
    try {
      await cadastroService(nome, numero, cnpj, endereco, email, senha);
      await login(email, senha);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      setError(errorMessage);
    }
  };

  const sendCodigo = async (email: string) => {
    try {
      return await sendCodigoService(email);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Erro ao enviar código de verificação. Tente novamente.";
      console.error("Erro no sendCodigo:", errorMessage);
      throw new Error(errorMessage);
    }
  };
  

  const verifyCodigo = async (email: string, token: string) => {
    try {
      return await verifyCodigoService(email, token);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Erro ao verificar código de verificação. Tente novamente.";
        throw new Error(errorMessage);
    }
    return false;
  };

  const resetPassword = async (email: string,token:string, novaSenha: string) => {
    try {
      return await resetPasswordService(email,token, novaSenha);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Erro ao resetar senha. Tente novamente.";
        throw new Error(errorMessage);
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    islogout();
  };

  return {
    login,
    cadastroAndLogin,
    sendCodigo,
    verifyCodigo,
    resetPassword,
    logout,
    error,
  };
};
