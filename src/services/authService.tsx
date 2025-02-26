import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const loginService = async (email: string, senha: string) => {
  try {
    const response = await api.post("/adote/auth/login", { email, senha });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro na requisição:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const cadastroService = async (
  email: string,
  senha: string,
  nome: string,
  cnpj: string,
  cep: string,
  numero: string
) => {
  try {
    const response = await api.post("/adote/auth/register", {
      email,
      senha,
      nome,
      cnpj,
      cep,
      numero,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro na requisição:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const resetPasswordService = async (email: string, password: string) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.post(
      "/auth/password-reset",
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro na requisição:",
      error?.response?.data || error.message
    );
    throw error;
  }
}
