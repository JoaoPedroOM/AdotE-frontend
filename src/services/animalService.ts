import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// export const cadastroAnimalService = async (
//   nome: string,
//   sexo: string,
//   porte: string,
//   vacinado: boolean,
//   fotos: File[]
// ) => {
//   const formData = new FormData();

//   formData.append("nome", nome);
//   formData.append("sexo", sexo);
//   formData.append("porte", porte);
//   formData.append("vacinado", vacinado.toString());

//   for (let i = 0; i < fotos.length; i++) {
//     formData.append("fotos", fotos[i]); // "fotos" é a key esperada no backend
//   }

//   const token = Cookies.get("authToken");

//   try {
//     const response = await api.post("/animal/create", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

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
    const response = await api.delete(`/animal/delete?animalId=${id}`,
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
