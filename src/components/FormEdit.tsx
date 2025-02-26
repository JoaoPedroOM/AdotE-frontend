import { useEffect } from "react";
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
import { useForm } from "react-hook-form";
import { AnimalFormValues, animalSchema } from "@/schemas/cadastroSchema";
import type { Animal } from "@/models/animal";

interface FormEditProps {
  animal: Animal | null;
  localizacao: string;
}

const FormEdit = ({ animal, localizacao }: FormEditProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
  });

  // Atualiza os valores do formulário quando recebe um novo animal
  useEffect(() => {
    if (animal) {
      setValue("nome", animal.nome);
      setValue("sexo", animal.sexo === "MACHO" ? "Macho" : "Fêmea");
      setValue(
        "porte",
        animal.porte === "PEQUENO"
          ? "Pequeno"
          : animal.porte === "MÉDIO"
          ? "Medio"
          : "Grande"
      );
      setValue("vacinado", animal.vacinado);
    }
  }, [animal, setValue]);

  async function onSubmit(data: AnimalFormValues) {
    console.log("DADOS DO FORMULÁRIO", data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Editar</Button>
      </DialogTrigger>
      <DialogContent className="z-[999] max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Editar Informações do Animal
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Edite os campos abaixo para atualizar as informações do animal.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              placeholder="Nome do animal"
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              {...register("nome")}
            />
            <ErrorMessage
              errors={errors}
              name="nome"
              as="p"
              className="text-xs font-semibold text-red-700 mt-1"
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sexo
            </label>
            <select
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              {...register("sexo")}
            >
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
            <ErrorMessage
              errors={errors}
              name="sexo"
              as="p"
              className="text-xs font-semibold text-red-700 mt-1"
            />
          </div>

          {/* Porte */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Porte
            </label>
            <select
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              {...register("porte")}
            >
              <option value="Pequeno">Pequeno</option>
              <option value="Medio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
            <ErrorMessage
              errors={errors}
              name="porte"
              as="p"
              className="text-xs font-semibold text-red-700 mt-1"
            />
          </div>

          {/* Vacinado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vacinado
            </label>
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register("vacinado")}
            />
          </div>

          {/* Fotos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fotos
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 3) {
                  alert("Você pode adicionar no máximo 3 fotos.");
                  return;
                }
                const newFotos = files.map((file) => URL.createObjectURL(file));
                setValue("fotos", [...(watch("fotos") || []), ...newFotos]);
              }}
            />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {animal?.fotos.map((foto: any, index: any) => (
                <div key={index} className="relative">
                  <img
                    src={foto.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setValue(
                        "fotos",
                        watch("fotos")?.filter(
                          (_: any, i: any) => i !== index
                        ) || []
                      );
                    }}
                    className="absolute top-2 right-2 text-xs"
                  >
                    Excluir
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Localização
            </label>
            <input
              type="text"
              placeholder="Localização"
              className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={localizacao}
              disabled
            />
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isSubmitting}
          >
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormEdit;
