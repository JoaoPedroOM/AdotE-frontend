import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const cadastroAnimalService = async (formData: FormData) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.post("/animal", formData, {
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
    const response = await api.patch(`/animal/${animalId}`, formData, {
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
    const response = await api.get(`/animal/organizacao/${id}`, {
      params: {
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAnimalService = async (id: number) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.delete(`/animal/${id}`, {
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
    const response = await api.get("/animal", {
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
    const response = await api.get(`/animal/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obterPerguntas = async () => {
  try {
    const response = await api.get(`/pergunta`);
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

    const response = await api.get("/organizacao", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const animaisByOrganizacaoService = async (
  id: number,
  page: number,
  tipo: string,
  idade: string,
  porte: string,
  sexo: string
) => {
  try {
    const response = await api.get(`/animal/organizacao/${id}`, {
      params: {
        // id,
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

export const obterDetalhesOrganizacao = async (id: number) => {
  try {
    const response = await api.get(`/organizacao/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// FORCEI O ERRO AQUI
export const obterDadosChavePixService = async (id: number) => {
  try {
    const response = await api.get(`/chavepix/organizacao/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cadastroChavePixService = async (
  tipoChave: string,
  chave: string,
  organizacao_id: number
) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.post(
      "/chavepix",
      {
        tipo: tipoChave,
        chave: chave,
        organizacao_id: organizacao_id,
      },
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

export const atualizarChavePixService = async (
  pixId: number,
  tipo: string,
  chave: string
) => {
  const token = Cookies.get("authToken");

  const response = await api.patch(
    `/chavepix/${pixId}`,
    { tipo, chave },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const enviaFormularioService = async (dadosEnvio: any) => {
  try {
    const response = await api.post("/formulario", dadosEnvio);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const formulariosAnimaisService = async (organizacaoId: number) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.get(
      `/formulario/organizacao/${organizacaoId}/animais`,
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

export const getFormulariosByAnimalId = async (animalId: number) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.get(`/formulario/animal/${animalId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const recusarFormularioService = async (
  formId: number,
  mensagem: string
) => {
  const token = Cookies.get("authToken");

  try {
    const response = await api.post(
      `/formulario/recusar/${formId}`,
      { mensagem },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const aceitaFormularioService = async (formId: number) => {
  const token = Cookies.get("authToken");
  try {
    const response = await api.post(
      `/formulario/aceitar/${formId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao aceitar formulário:", error);
    throw error;
  }
};

export const excluirFormularioService = async (formId: number) => {
  const token = Cookies.get("authToken");
  try {
    const response = await api.delete(`/formulario/${formId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir formulário:", error);
    throw error;
  }
};

export const fetchStatesService = async () => {
  const response = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
  );
  if (!response.ok) {
    throw new Error("Falha ao carregar estados");
  }
  return response.json();
};

export const fetchCitiesService = async (stateUF: string) => {
  if (!stateUF) return [];
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateUF}/municipios?orderBy=nome`
  );
  if (!response.ok) {
    throw new Error("Falha ao carregar cidades");
  }
  return response.json();
};
