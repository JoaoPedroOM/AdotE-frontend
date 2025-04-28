import {
  atualizarChavePixService,
  cadastroAnimalService,
  cadastroChavePixService,
  updateAnimalService,
  enviaFormularioService,
} from "@/services/animalService";
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
        organizacao_id,
      };

      const json = JSON.stringify(dadosAnimal);
      const blob = new Blob([json], { type: "application/json" });
      formData.append("dados", blob);

      fotos.forEach((foto) => {
        formData.append("fotos", foto);
      });

      setError(null);
      await cadastroAnimalService(formData);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao cadastrar animal. Tente novamente.";
      setError(errorMessage);
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
      const json = JSON.stringify(changedFields);
      const dadosBlob = new Blob([json], { type: "application/json" });
      formData.append("dados", dadosBlob);

      newImages.forEach((file) => {
        formData.append("novasFotos", file);
      });

      if (imagesToDelete.length > 0) {
        const removerFotos = JSON.stringify(imagesToDelete);
        const fotosParaRemoverBlob = new Blob([removerFotos], {
          type: "application/json",
        });
        formData.append("fotosParaRemover", fotosParaRemoverBlob);
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
      return false;
    }
  };

  const cadastroChavePix = async (
    tipoChave: string,
    chave: string,
    organizacao_id: number
  ) => {
    try {
      await cadastroChavePixService(tipoChave, chave, organizacao_id);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao atualizar animal. Tente novamente.";
      setError(errorMessage);
      return false;
    }
  };

  const atualizarChavePix = async (
    pixId: number,
    tipo: string,
    chave: string
  ) => {
    try {
      await atualizarChavePixService(pixId, tipo, chave);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao atualizar chave pix. Tente novamente.";
      setError(errorMessage);
      return false;
    }
  };

  const envioFormulario = async (
    dadosEnvio: any
  ) => {
    try{
      return await enviaFormularioService(dadosEnvio)
    }catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao enviar formulário. Tente novamente.";
      throw new Error(errorMessage);
    }
    return false;
  }

  return {
    cadastrarAnimal,
    atualizaAnimal,
    cadastroChavePix,
    atualizarChavePix,
    envioFormulario,
    error,
  };
};
