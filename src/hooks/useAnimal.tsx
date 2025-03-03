import { cadastroAnimalService, updateAnimalService } from "@/services/animalService";
import { useState } from "react";

export const useAnimal = () => {
  const [error, setError] = useState<string | null>(null);

  const cadastrarAnimal = async (
    nome: string,
    tipo: string,
    sexo: string,
    porte: string,
    idade: string,
    vacinado: boolean,
    castrado: boolean,
    vermifugado: boolean,
    srd: boolean,
    descricao: string,
    fotos: File[],
    organizacao_id: number
  ) => {

    try {
      // Criando o FormData
      const formData = new FormData();
      const dadosAnimal = {
        nome,
        tipo,
        sexo,
        porte,
        idade,
        vacinado,
        castrado,
        vermifugado,
        srd,
        descricao,
        organizacao_id
      };
      
      const json = JSON.stringify(dadosAnimal);
      const blob = new Blob([json], { type: "application/json" });
      formData.append("dados", blob); // Chave deve ser "dados" (igual ao @RequestPart do backend)

      // Adicionando as fotos
      fotos.forEach((foto) => {
        formData.append("fotos", foto);
      });

      // Chamando o serviço para cadastrar o animal
      setError(null); 
      const data = await cadastroAnimalService(formData);
      console.log("Animal cadastrado com sucesso!", data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao cadastrar animal. Tente novamente.";
      setError(errorMessage); // Definindo erro
    }
  };

  const atualizaAnimal = async (
    animalId: number,
    changedFields: Record<string, any>,
    newImages: File[],
    imagesToDelete: string[]
  ) => {
    try {
      const formData = new FormData();
      
      const dadosBlob = new Blob([JSON.stringify(changedFields)], {type: "application/json",});
      formData.append("dados", dadosBlob);
  
      // Adicione novas imagens
      newImages.forEach((file) => {
        formData.append("novasFotos", file)
      });

      if (imagesToDelete.length > 0) {
        formData.append("fotosParaRemover", JSON.stringify(imagesToDelete));
      }
  
      await updateAnimalService(animalId, formData);
      setError(null);
      return true;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao atualizar animal. Tente novamente.";
      setError(errorMessage); 
    }
  };
  return { cadastrarAnimal, atualizaAnimal, error };
};