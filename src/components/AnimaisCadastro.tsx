import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";

import {
  AnimalFormValues,
  animalSchema,
} from "@/schemas/cadastroSchema";
import { useState } from "react";
import { useAnimal } from "@/hooks/useAnimal";
import { useAuthStore } from "@/stores/useAuthStore";

import { useQueryClient } from "@tanstack/react-query";

const AnimaisCadastro = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const { organizacao } = useAuthStore();
  const queryClient = useQueryClient();

 const organizacao_id = Number(organizacao?.organizacao_id);

  const {cadastrarAnimal, error} = useAnimal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const allowedFiles = newFiles.slice(0, 3 - files.length);

      const newUrls = allowedFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...allowedFiles]);
      setPreviewUrls((prev) => [...prev, ...newUrls]);

      setValue("fotos", [...files, ...allowedFiles]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    setValue("fotos", updatedFiles);
  };

  async function onSubmit(data: FieldValues) {
    try {
      const fotos = data.fotos;
      const sexoUpperCase = data.sexo.toUpperCase();
      const porteUpperCase = data.porte.toUpperCase();
  
      if (fotos.length > 0) {
        await cadastrarAnimal(data.nome, sexoUpperCase, porteUpperCase, data.vacinado, fotos, organizacao_id);
      
        reset({
          nome: "",
          fotos: [],
        });
        setFiles([]);
        setPreviewUrls([]);

        queryClient.invalidateQueries({ queryKey: ['animais', organizacao_id] });
      } else {
        console.error("Nenhuma foto foi selecionada.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar animal:", error);
    }
    
    console.log("Dados do formulário:", data);
    reset({
      nome: "",
      fotos: [],
    });
    setFiles([]);
    setPreviewUrls([]);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-orange-300 text-black hover:bg-orange-400"
        >
          Cadastrar
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[999] max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Cadastro de Animal
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Preencha as informações do animal para concluir o cadastro.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Campos de nome, sexo, porte, vacinado */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              placeholder="Nome do animal"
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              {...register("nome")}
            />
            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="nome" />
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Sexo
            </label>
            <select
              id="sexo"
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              {...register("sexo")}
            >
              <option value="Macho">Macho</option>
              <option value="Femea">Fêmea</option>
            </select>

            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="sexo" />
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Porte
            </label>
            <select
              id="porte"
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              {...register("porte")}
            >
              <option value="Pequeno">Pequeno</option>
              <option value="Medio">Médio</option>
              <option value="Grande">Grande</option>
            </select>

            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="porte" />
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Vacinado
            </label>
            <input
              type="checkbox"
              id="vacinado"
              className="h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
              {...register("vacinado")}
            />
            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="vacinado" />
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fotos
            </label>
            <input
              type="file"
              id="fotos"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="fotos" />
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 text-xs"
                  >
                    Excluir
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            Cadastrar animal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnimaisCadastro;
