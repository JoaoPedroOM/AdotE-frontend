import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const cadastroAnimalService = async (formData: FormData) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.post("/animal/create", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAnimalService = async (
  animalId: number,
  formData: FormData
) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.patch(`/animal/update/${animalId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Algo de errado aconteceu:", error);
    throw error;
  }
};

export const animaisCadastrados = async (id: any, page: number) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.get(
      `/animal/find/all?orgId=${id}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAnimalService = async (id: number) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.delete(`/animal/delete?animalId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const animaisDisponiveis = async (
  page: number,
  tipo: string,
  idade: string,
  porte: string,
  sexo: string
) => {
  try {
    const response = await api.get("/animal/find/all", {
      params: {
        page,
        tipo,
        idade,
        porte,
        sexo,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const animalProfile = async (id: number) => {
  try {
    const response = await api.get(`/animal/find?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const organizacoesDisponiveis = async (
  page: number,
  estado: string,
  cidade: string
) => {
  try {
    const params = {
      page,
      ...(estado && { estado }),
      ...(cidade && { cidade }),
    };

    const response = await api.get("/organizacao/find/all", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const organizacaoDetails = async (
  id: number,
  page: number,
  tipo: string,
  idade: string,
  porte: string,
  sexo: string
) => {
  try {
    const response = await api.get(
      `/organizacao/find`,
      {
        params: {
          id,
          page,
          tipo,
          idade,
          porte,
          sexo,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
