import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const loginService = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
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
  password: string,
  role: string,
  name: string,
  cnpj: string,
  postalCode: string,
  phoneNumber: string
) => {
  try {
    const response = await api.post("/auth/register/organization", {
      email,
      password,
      role,
      name,
      cnpj,
      postalCode,
      phoneNumber,
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
