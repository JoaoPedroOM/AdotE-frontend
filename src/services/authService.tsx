import axios from "axios";

const api = axios.create({
  baseURL:  import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const loginService = async (email: string, senha: string) => {
  try {
    const response = await api.post("/auth/login", { email, senha });
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
  nome: string,
  numero: string,
  cnpj: string,
  endereco: any,
  email: string,
  senha: string,
) => {
  try {
    const response = await api.post("/auth/register", {
      nome,
      numero,
      cnpj, 
      endereco,
      email,
      senha
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

export const sendCodigoService = async (email: string) => {
  try{
    const response = await api.post("/reset-password/request", { email });
    return response.data;
  }catch (error: any) {
    console.error(
      "Erro na requisição:",
      error?.response?.data || error.message
    );
    throw error;
  }
}

export const verifyCodigoService = async (email: string, token: string) => {
  try {
    const response = await api.post("/reset-password/verify", { email, token });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro na requisição:",
      error?.response?.data || error.message
    );
    throw error;
  }
}

export const resetPasswordService = async (email: string, token: string, novaSenha: string) => {

  try {
    const response = await api.post("/reset-password/new-password",{ email, token, novaSenha });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro na requisição:",
      error?.response?.data || error.message
    );
    throw error;
  }
}
