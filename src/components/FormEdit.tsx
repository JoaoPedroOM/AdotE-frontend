import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimalFormValues, animalSchema } from "@/schemas/cadastroSchema";
import type { Animal } from "@/models/animal";
import {deleteAnimalService} from "@/services/animalService";
import { useQueryClient } from "@tanstack/react-query";
import { usePaginationStore } from "@/stores/usePaginationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { useAnimal } from "@/hooks/useAnimal";

interface FormEditProps {
  animal: Animal | null;
  localizacao: string;
}

const FormEdit = ({ animal, localizacao }: FormEditProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [originalValues, setOriginalValues] = useState<any>({});
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const { atualizaAnimal } = useAnimal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
  });

  const { organizacao } = useAuthStore();
  const {
    currentPage: page,
    setCurrentPage: setPage,
    animalLength,
  } = usePaginationStore();

  const queryClient = useQueryClient();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Atualiza os valores do formulário quando recebe um novo animal
  useEffect(() => {
    if (animal) {
      // Set form values
      const formValues = {
        nome: animal.nome,
        tipo: animal.tipo === "CACHORRO" ? "Cachorro" : "Gato",
        idade:
          animal.idade === "FILHOTE"
            ? "Filhote"
            : animal.idade === "JOVEM"
            ? "Jovem"
            : "Adulto",
        sexo: animal.sexo === "MACHO" ? "Macho" : "Femea",
        porte:
          animal.porte === "PEQUENO"
            ? "Pequeno"
            : animal.porte === "MEDIO"
            ? "Medio"
            : "Grande",
        vacinado: animal.vacinado,
        castrado: animal.castrado,
        vermifugado: animal.vermifugado,
        srd: animal.srd,
        descricao: animal.descricao,
        fotos: animal.fotos.map((foto) => foto.url),
      };

      // Set form values
      Object.entries(formValues).forEach(([key, value]) => {
        setValue(key as any, value);
      });

      // Store original values for comparison later
      setOriginalValues(formValues);

      // Extract existing image URLs
      const urls = animal.fotos.map((foto) => foto.url);
      setImageUrls(urls);

      // Reset image tracking states when dialog opens
      setImagesToDelete([]);
      setNewImages([]);
    }
  }, [animal?.id, setValue, isDialogOpen]);

  // Function to check what fields have changed
  const getChangedFields = (data: AnimalFormValues) => {
    const changedFields: Record<string, any> = {};
  
    Object.entries(data).forEach(([key, value]) => {
      if (key === "fotos") return;
  
      // Comparação direta sem JSON.stringify
      if (value !== originalValues[key]) {
        changedFields[key] = value;
      }
    });
  
    return changedFields;
  };
  

  const convertToBackendValues = (changedFields: Record<string, any>) => {
    const converted = { ...changedFields };
    
    if (converted.tipo) {
      converted.tipo = converted.tipo === "Cachorro" ? "CACHORRO" : "GATO";
    }
    if (converted.sexo) {
      converted.sexo = converted.sexo === "Macho" ? "MACHO" : "FEMEA";
    }
    if (converted.porte) {
      converted.porte = converted.porte === "Pequeno" ? "PEQUENO" :
        converted.porte === "Medio" ? "MEDIO" : "GRANDE";
    }
    if (converted.idade) {
      converted.idade = converted.idade === "Filhote" ? "FILHOTE" :
        converted.idade === "Jovem" ? "JOVEM" : "ADULTO";
    }
  
    return converted;
  };

  async function onSubmit(data: AnimalFormValues) {
    if (!animal) return;
  
    try {
      const changedFields = getChangedFields(data);
      
      // Verifica se há alterações
      const hasChanges = 
        Object.keys(changedFields).length > 0 ||
        newImages.length > 0 ||
        imagesToDelete.length > 0;
  
      if (!hasChanges) {
        toast.info("Nenhuma alteração detectada.");
        setIsDialogOpen(false);
        return;
      }
  
      // Conversão para valores do backend
      const backendChangedFields = convertToBackendValues(changedFields);
      
      await atualizaAnimal(
        animal.id, 
        backendChangedFields, 
        newImages, 
        imagesToDelete
      );
  
      toast.success("Animal atualizado com sucesso!");
      setIsDialogOpen(false);
  
      queryClient.invalidateQueries({
        queryKey: ["animais", organizacao?.organizacao_id, page],
      });
    } catch (error) {
      console.error("Erro ao atualizar animal:", error);
      toast.error("Erro ao atualizar o animal.");
    }
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 3 total images (existing + new)
    const totalImagesCount =
      imageUrls.length -
      imagesToDelete.length +
      newImages.length +
      files.length;
    if (totalImagesCount > 3) {
      toast.error("Você pode ter no máximo 3 fotos no total.");
      return;
    }

    const newFileUrls = files.map((file) => URL.createObjectURL(file));

    setValue("fotos", [
      ...(watch("fotos")?.filter((url : any) => !imagesToDelete.includes(url)) || []),
      ...newFileUrls,
    ]);
    setNewImages((prev) => [...prev, ...files]);
  };
  const handleImageDelete = (index: number) => {
    const currentImages = watch("fotos") || [];
    const imageToRemove = currentImages[index];

    if (originalValues.fotos?.includes(imageToRemove)) {
      setImagesToDelete((prev) => [...prev, imageToRemove]);
    } else {
      const objectUrl = imageToRemove;
      setNewImages((prev) =>
        prev.filter((file) => URL.createObjectURL(file) !== objectUrl)
      );

      URL.revokeObjectURL(objectUrl);
    }

    setValue(
      "fotos",
      currentImages.filter((_ : any, i:any) => i !== index)
    );
  };

  async function deleteAnimal(animalId: number) {
    if (animalLength === 1 && page > 0) {
      try {
        setPage(page - 1);
        await deleteAnimalService(animalId);
        toast.success("Seu animal foi excluído com sucesso!");
        setIsDialogOpen(false);

        queryClient.invalidateQueries({
          queryKey: ["animais", organizacao?.organizacao_id],
        });
      } catch (error) {
        console.error("Erro ao deletar animal:", error);
        toast.error("Erro ao excluir o animal.");
      }
    } else {
      try {
        await deleteAnimalService(animalId);
        toast.success("Seu animal foi excluído com sucesso!");
        setIsDialogOpen(false);

        await queryClient.invalidateQueries({
          queryKey: ["animais", organizacao?.organizacao_id, page],
        });
      } catch (error) {
        console.error("Erro ao deletar animal:", error);
        toast.error("Erro ao excluir o animal.");
      }
    }
  }

  useEffect(() => {
    return () => {
      if (watch("fotos")) {
        watch("fotos").forEach((url : any) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [watch]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Editar</Button>
      </DialogTrigger>
      <DialogContent className="z-[999] max-w-[750px] w-full mx-auto px-5 py-8 bg-white rounded-lg shadow-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Editar Informações do Animal
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Edite os campos abaixo para atualizar as informações do animal.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6 overflow-y-auto flex-grow px-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <div className="grid grid-cols-2 md:gap-3 gap-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Animal
              </label>
              <select
                id="tipo"
                className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                {...register("tipo")}
              >
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
              </select>

              <ErrorMessage
                errors={errors}
                name="tipo"
                as="p"
                className="text-xs font-semibold text-red-700 mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Idade
              </label>
              <select
                id="idade"
                className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                {...register("idade")}
              >
                <option value="Filhote">Filhote</option>
                <option value="Jovem">Jovem</option>
                <option value="Adulto">Adulto</option>
                <option value="Idoso">Idoso</option>
              </select>

              <ErrorMessage
                errors={errors}
                name="idade"
                as="p"
                className="text-xs font-semibold text-red-700 mt-1"
              />
            </div>
          </div>

          {/* Sexo */}
          <div className="grid grid-cols-2 md:gap-3 gap-1">
            <div>
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

              <ErrorMessage
                errors={errors}
                name="sexo"
                as="p"
                className="text-xs font-semibold text-red-700 mt-1"
              />
            </div>

            <div>
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

              <ErrorMessage
                errors={errors}
                name="porte"
                as="p"
                className="text-xs font-semibold text-red-700 mt-1"
              />
            </div>
          </div>

          {/* Vacinação */}
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vacinado
              </label>
              <input
                type="checkbox"
                id="vacinado"
                className="h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                checked={watch("vacinado")}
                {...register("vacinado")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="vacinado" />
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Castrado
              </label>
              <input
                type="checkbox"
                id="castrado"
                className="h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                {...register("castrado")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="castrado" />
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vermifugação
              </label>
              <input
                type="checkbox"
                id="vermifugado"
                className="h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                {...register("vermifugado")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="vermifugado" />
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sem Raça
              </label>
              <input
                type="checkbox"
                id="srd"
                className="h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                {...register("srd")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="srd" />
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <Textarea
              id="descricao"
              className="h-32 resize-none"
              {...register("descricao")}
            />
            <ErrorMessage
              errors={errors}
              name="descricao"
              as="p"
              className="text-xs font-semibold text-red-700 mt-1"
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
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo de 3 fotos no total.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(watch("fotos") || []).map((foto : any, index : any) => (
                <div key={index} className="relative">
                  <img
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-2 right-2 text-xs p-1 h-6"
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

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => animal && deleteAnimal(animal.id)}
              disabled={isSubmitting}
            >
              Excluir animal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormEdit;
