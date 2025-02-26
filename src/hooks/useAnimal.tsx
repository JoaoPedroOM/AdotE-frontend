import { cadastroAnimalService } from "@/services/animalService";
import { useState } from "react";

export const useAnimal = () => {
  const [error, setError] = useState<string | null>(null);

  const cadastrarAnimal = async (
    nome: string,
    sexo: string,
    porte: string,
    vacinado: boolean,
    fotos: File[],
    organizacao_id: number
  ) => {

    try {
      // Criando o FormData
      const formData = new FormData();
      const dadosAnimal = {
        nome,
        sexo,
        porte,
        vacinado,
        organizacao_id
      };
      
      const json = JSON.stringify(dadosAnimal);
      const blob = new Blob([json], { type: "application/json" });
      formData.append("dados", blob); // Chave deve ser "dados" (igual ao @RequestPart do backend)
  
      // formData.append("nome", nome);
      // formData.append("sexo", sexo);
      // formData.append("porte", porte);
      // formData.append("vacinado", vacinado.toString());
      // formData.append("organizacao_id", organizacao_id.toString());

      // Adicionando as fotos
      fotos.forEach((foto) => {
        formData.append("fotos", foto);
      });

      // Chamando o serviço para cadastrar o animal
      const data = await cadastroAnimalService(formData);
      console.log("Animal cadastrado com sucesso!", data);
      setError(null); // Limpando qualquer erro anterior
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao cadastrar animal. Tente novamente.";
      setError(errorMessage); // Definindo erro
    }
  };


  return { cadastrarAnimal, error};

};
