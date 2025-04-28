import {
  aceitaFormularioService,
  formulariosAnimaisService,
  getFormulariosByAnimalId,
  recusarFormularioService,
} from "@/services/animalService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MotivoFormValues,
  motivoSchema,
} from "@/schemas/deleteFormularioSchema";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CheckCircle, Hourglass } from "lucide-react";
import FormularioRespostas from "./FormularioRespostas";

interface AdotanteForme {
  id: number;
  nomeAdotante: string;
  email: string;
  idade: number;
  telefone: string;
  cpf: string;
  dataEnvio: string;
  respostas: {
    id: number;
    pergunta: string;
    resposta: string;
  }[];
  status: string;
}

interface Animal {
  id: number;
  animal: {
    id: number;
    nome: string;
    fotos: {
      id: number;
      url: string;
    };
  };
  formulariosEnviados: number;
}

const AnimalMessages: React.FC = () => {
  const queryClient = useQueryClient();
  const { organizacao } = useAuthStore();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [expandedFormId, setExpandedFormId] = useState<number | null>(null);
  const [formIdToDelete, setFormIdToDelete] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MotivoFormValues>({
    resolver: zodResolver(motivoSchema),
  });

  // Formulário para todos os animais
  const {
    data: animaisForms = [],
    isLoading: animaisFormsLoading,
    error: animaisFormsError,
  } = useQuery({
    queryKey: ["animaisForms", organizacao?.organizacao_id],
    queryFn: () =>
      formulariosAnimaisService(Number(organizacao?.organizacao_id)),
    enabled: !!organizacao?.organizacao_id,
    staleTime: 20 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // Formulários do animal selecionado
  const {
    data: animalForms = [],
    isLoading: animalFormsLoading,
    error: animalFormsError,
  } = useQuery({
    queryKey: ["animalForms", selectedAnimal?.id],
    queryFn: () => getFormulariosByAnimalId(selectedAnimal?.id as number),
    enabled: !!selectedAnimal?.id,
    staleTime: 20 * 60 * 1000,
    placeholderData: () =>
      queryClient.getQueryData(["animalForms", selectedAnimal?.id]),
  });

  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setExpandedFormId(null);
    queryClient.invalidateQueries({
      queryKey: ["animalForms"],
    });
  };

  const handleFormToggle = (formId: number) => {
    setExpandedFormId(expandedFormId === formId ? null : formId);
  };

  const openDenyModal = (formId: number) => {
    setFormIdToDelete(formId);
    setModalOpen(true);
  };

  const onSubmitDeny = async (data: MotivoFormValues) => {
    try {
      await recusarFormularioService(
        Number(formIdToDelete),
        data.justificativa
      );
      toast.success("Formulário recusado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["animaisForms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["animalForms"],
      });
      reset();
      setModalOpen(false);
      setSelectedAnimal(null);
    } catch (error) {
      console.error("Erro ao deletar formulário:", error);
      toast.error("Erro ao deletar formulário.");
    }
  };

  const handleAccept = async (form: AdotanteForme) => {
   try{
    await aceitaFormularioService(Number(form.id));
    toast.success("Formulário aceito com sucesso!");
    queryClient.invalidateQueries({
      queryKey: ["animaisForms"],
    });
    queryClient.invalidateQueries({
      queryKey: ["animalForms"],
    });
    setExpandedFormId(null);
   }catch(error){
    console.error("Erro ao aceitar formulário:", error);
    toast.error("Erro ao aceitar formulário.");
   }
  };

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 font-main">
        Formulários de Adoção
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-[#f7fafc] rounded-lg shadow-md p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 font-tertiary">
            Pedidos de Adoção
          </h2>
          {animaisFormsError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
              Erro ao carregar formulários: {animaisFormsError.message}
            </div>
          )}
          {animaisFormsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center py-3">
                  <Skeleton className="w-12 h-10 rounded-full mr-3" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : animaisForms.length === 0 ? (
            <p className="text-gray-500 font-tertiary text-center">
              Nenhum formulário recebido.
            </p>
          ) : (
            <ul className="space-y-3">
              {animaisForms.map((animal: Animal) => (
                <li
                  key={animal.id}
                  onClick={() => handleAnimalClick(animal)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    selectedAnimal?.id === animal.id ? "bg-gray-200" : ""
                  }`}
                >
                  <img
                    src={animal.animal.fotos?.url}
                    alt={animal.animal.nome}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-[18px] text-gray-900 font-main">
                        {animal.animal.nome}
                      </p>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>
                    <p className="text-[14px] text-gray-600 font-tertiary">
                      {animal.formulariosEnviados} formulário
                      {animal.formulariosEnviados > 1 ? "s" : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4">
          {animaisForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 font-tertiary text-center">
                Sem mensagens até o momento
              </p>
            </div>
          ) : selectedAnimal ? (
            <>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 font-main">
                Formulários para {selectedAnimal.animal.nome}
              </h2>

              {animalFormsError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
                  Erro ao carregar formulários: {animalFormsError.message}
                </div>
              )}

              {animalFormsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="border rounded-lg bg-gray-50">
                      <div className="p-4 bg-gray-100 rounded-t-lg">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-4 w-[20%]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : animalForms.length === 0 ? (
                <p className="text-gray-500 font-tertiary">
                  Nenhum formulário para este animal.
                </p>
              ) : (
                <div className="space-y-2">
                  {animalForms.map((form: AdotanteForme) => (
                    <div key={form.id} className="border rounded-lg bg-gray-50">
                      <div
                        className="md:p-4 px-2 py-4 bg-gray-100 rounded-t-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
                        onClick={() => handleFormToggle(form.id)}
                      >
                        <h3 className="text-base font-tertiary text-gray-800 font-bold">
                          {form.nomeAdotante}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 text-xs font-semibold font-tertiary rounded-md flex items-center gap-1 ${
                              form.status === "PENDENTE"
                                ? "bg-yellow-500 text-white"
                                : form.status === "APROVADO"
                                ? "bg-green-500 text-white"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <span className="block md:hidden">
                              {form.status === "APROVADO" && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              {form.status === "PENDENTE" && (
                                 <Hourglass className="w-4 h-4"/>
                              )}
                            </span>

                            <span className="hidden md:block">
                              {form.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-tertiary">
                            {form.dataEnvio}
                          </p>
                        </div>
                      </div>
                      {expandedFormId === form.id && (
                        <div className="p-4 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 font-tertiary">
                              Dados Pessoais
                            </h4>
                            <p className="text-gray-800 font-tertiary">
                              Nome: {form.nomeAdotante}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              Idade: {form.idade}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              CPF: {form.cpf}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              Telefone: {form.telefone}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              Email: {form.email}
                            </p>
                          </div>

                          <FormularioRespostas respostas={form.respostas} />
                          

                          <div className="flex gap-2">
                            <button
                              onClick={() => openDenyModal(form.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-tertiary"
                            >
                              Recusar
                            </button>
                            {form.status !== "APROVADO" && (
                              <button
                                onClick={() => handleAccept(form)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-tertiary"
                              >
                                Aceitar
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 font-tertiary text-center">
                Selecione um animal para visualizar os formulários.
              </p>
            </div>
          )}
        </div>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="z-[999]">
          <DialogHeader>
            <DialogTitle className="font-tertiary">
              Recusar Formulário de Adoção
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitDeny)} className="space-y-4">
            <Textarea
              placeholder="Descreva o motivo da recusa"
              {...register("justificativa")}
              className="resize-none h-40"
            />
            {errors.justificativa && (
              <p className="text-sm text-red-500 font-tertiary">
                {errors.justificativa.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={isSubmitting}
              >
                Confirmar Recusa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnimalMessages;
