import { useState } from "react";
import { KeyRound, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import CardInfoOrganizacao from "./CardInfoOrganizacao";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganizacaoFormValues,
  organizacaoSchema,
} from "@/schemas/organizacaoSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  obterDetalhesOrganizacao,
} from "@/services/animalService";
import { Skeleton } from "./ui/skeleton";
import { useAnimal } from "@/hooks/useAnimal";
import { toast } from "sonner";

const OrganizacaoConfig = () => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [currentPixId, setCurrentPixId] = useState<number | null>(null);

  const { cadastroChavePix, atualizarChavePix } = useAnimal();

  const { organizacao } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: organizacaoData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizacaoData", Number(organizacao?.organizacao_id)],
    queryFn: () =>
      obterDetalhesOrganizacao(Number(organizacao?.organizacao_id)),
    staleTime: 20 * 60 * 1000,
  });

  console.log(organizacaoData)

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizacaoFormValues>({
    resolver: zodResolver(organizacaoSchema),
    mode: "onBlur",
  });

  const openModal = () => {
    if (organizacaoData.chavesPix.length > 0) {
      const chaveExistente = organizacaoData.chavesPix[0];
      reset({
        tipoChave: chaveExistente.tipo,
        chave: chaveExistente.chave,
      });
      setCurrentPixId(chaveExistente.id);
      setIsEditing(true);
    } else {
      reset({
        tipoChave: "TELEFONE",
        chave: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  async function onSubmit(data: OrganizacaoFormValues) {
    try {
      if (isEditing && currentPixId) {
        await atualizarChavePix(currentPixId, data.tipoChave.toUpperCase(), data.chave);
        toast.success("Chave atualizada com sucesso!");
      } else {
        await cadastroChavePix(
          data.tipoChave.toUpperCase(),
          data.chave,
          Number(organizacao?.organizacao_id)
        );
        toast.success("Chave cadastrada com sucesso!");
      }
      queryClient.invalidateQueries({
        queryKey: ["organizacaoData", Number(organizacao?.organizacao_id)],
      });
      reset();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        isEditing
          ? "Erro ao atualizar chave pix!"
          : "Erro ao cadastrar chave pix!"
      );
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:gap-10 sm-max:justify-items-center">
      <div className="md:col-span-2 sm-max:w-full">
        {/* PIX Section */}
        <div className="bg-[#f7fafc] rounded-lg border border-[#d1d5db] shadow-md md:p-6 p-4 mb-6 text-gray-900">
          <h2 className="md:text-xl text-[18px] font-semibold text-gray-800 mb-4 flex items-center gap-2 font-main">
            <Wallet className="h-5 w-5 text-primary" />
            Recebimento de doações
          </h2>

          <div className="space-y-4">
            {isLoading ? (
              <div className="md:p-4 p-0 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ) : organizacaoData && organizacaoData.chavesPix.length > 0 ? (
              <div className="md:p-4 p-0 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium md:text-base text-sm flex items-center gap-2 text-gray-700">
                    <KeyRound className="h-4 w-4 text-primary" />
                    Chave PIX registrada
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-black font-tertiary text-sm"
                    onClick={openModal}
                  >
                    Atualizar
                  </Button>
                </div>
                <p className="bg-[#eeeeee] py-2 px-3 rounded text-sm break-all text-gray-900 font-semibold">
                  {organizacaoData.chavesPix[0].chave}
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="font-tertiary mb-4 text-gray-600">
                  Você ainda não registrou uma chave PIX para receber doações.
                </p>
                <Button
                  className="bg-gray-100 hover:bg-gray-200 text-black"
                  onClick={openModal}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Registrar Chave PIX
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modal para adicionar ou atualizar chave PIX */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-full max-w-md z-[999] rounded-lg">
            <DialogTitle className="font-semibold text-gray-800 mb-2 text-2xl font-main">
              {isEditing ? "Atualizar Chave PIX" : "Cadastrar Chave PIX"}
              <p className="font-tertiary text-base font-medium leading-[1.5]">
                Registre sua chave PIX para começar a receber doações de
                apoiadores e fortalecer sua missão de resgatar e cuidar de
                animais.
              </p>
            </DialogTitle>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Escolher tipo de chave */}
              <div>
                <label className="block text-sm font-tertiary font-medium text-gray-700">
                  Tipo de Chave
                </label>
                <select
                  {...register("tipoChave")}
                  className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="TELEFONE">Telefone</option>
                  <option value="EMAIL">Email</option>
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="OUTRO">Chave aleatória</option>
                </select>
                <ErrorMessage
                  errors={errors}
                  name="tipoChave"
                  as="p"
                  className="text-xs font-semibold text-red-700 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-tertiary">
                  Digite a Chave
                </label>
                <input
                  type="text"
                  className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Digite sua chave"
                  {...register("chave")}
                />
                <ErrorMessage
                  errors={errors}
                  name="chave"
                  as="p"
                  className="text-xs font-semibold text-red-700 mt-1"
                />
              </div>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button className="text-white" disabled={isSubmitting}>
                  {isEditing ? "Atualizar" : "Cadastrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Informações da Organização - Lateral */}
      {isLoading ? (
        <div className="sticky top-6 sm-max:w-full">
          <div className="rounded-lg border bg-[#f7fafc] text-gray-900 shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-medium mb-4 font-main">
                Informações da Organização
              </h3>

              <div className="space-y-4">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CardInfoOrganizacao organizacaoData={organizacaoData} />
      )}

      {error && (
        <p className="text-red-500">
          {(error as Error).message ||
            "Erro ao carregar informações da organização."}
        </p>
      )}
    </div>
  );
};

export default OrganizacaoConfig;
