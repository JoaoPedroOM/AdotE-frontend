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
import { Separator } from "./ui/separator";

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
    try {
      await aceitaFormularioService(Number(form.id));
      toast.success("Formulário aceito com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["animaisForms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["animalForms"],
      });
      setExpandedFormId(null);
    } catch (error) {
      console.error("Erro ao aceitar formulário:", error);
      toast.error("Erro ao aceitar formulário.");
    }
  };

  function formatandoTelefoneWhatsApp(telefone: any) {
    const apenasNumero = telefone.replace(/\D/g, "");
    if (apenasNumero.length === 11) {
      return `55${apenasNumero}`;
    }
    return apenasNumero;
  }

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
                        <h3 className="text-base font-tertiary text-gray-800 font-bold flex-1 min-w-0 pr-4 truncate">
                          {form.nomeAdotante}
                        </h3>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-2 py-1 text-xs font-semibold font-tertiary rounded-md flex items-center gap-1 ${
                                form.status === "PENDENTE"
                                  ? "bg-yellow-500 text-white"
                                  : form.status === "APROVADO"
                                  ? "bg-green-500 text-white"
                                  : null
                              }`}
                            >
                              <span className="block md:hidden">
                                {form.status === "APROVADO" && (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                {form.status === "PENDENTE" && (
                                  <Hourglass className="w-4 h-4" />
                                )}
                              </span>
                              <span className="hidden md:block whitespace-nowrap">
                                {form.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-tertiary whitespace-nowrap">
                              {form.dataEnvio}
                            </p>
                          </div>
                        </div>
                      </div>
                      {expandedFormId === form.id && (
                        <div className="p-4 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 font-tertiary md:text-lg text-base">
                              Dados Pessoais
                            </h4>
                            <Separator className="my-2" />
                            <p className="text-gray-800 font-tertiary">
                              <span className="font-semibold text-gray-800">
                                Nome:
                              </span>{" "}
                              {form.nomeAdotante}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              <span className="font-semibold text-gray-800">
                                Idade:
                              </span>{" "}
                              {form.idade}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              <span className="font-semibold text-gray-800">
                                CPF:
                              </span>{" "}
                              {form.cpf}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              <span className="font-semibold text-gray-800">
                                Telefone:
                              </span>{" "}
                              {form.telefone}
                            </p>
                            <p className="text-gray-800 font-tertiary">
                              <span className="font-semibold text-gray-800">
                                Email:
                              </span>{" "}
                              {form.email}
                            </p>
                          </div>

                          <FormularioRespostas respostas={form.respostas} />

                          {form.status === "APROVADO" ? (
                            <div className="flex md:flex-row flex-col-reverse gap-2">
                              <button className="px-4 py-2 md:text-[16px] text-[14px] bg-red-600 hover:bg-red-700 text-white rounded-lg font-tertiary">
                                Excluir
                              </button>
                              {form.telefone && (
                                <a
                                  href={`https://wa.me/${formatandoTelefoneWhatsApp(
                                    form.telefone
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center md:text-[16px] text-[14px] gap-2 px-4 py-2 rounded-lg font-tertiary text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                  Chamar no WhatsApp
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="md:w-5 md:h-5 w-4 h-4"
                                  >
                                    <path d="M20.52 3.48a12 12 0 0 0-16.97 0 12 12 0 0 0-2.3 13.89L.27 23.72l6.56-1.94A12 12 0 0 0 12 24c3.2 0 6.2-1.24 8.48-3.52a12 12 0 0 0 0-16.97zM12 22a9.94 9.94 0 0 1-5.16-1.45l-.37-.22-3.89 1.15 1.17-3.79-.25-.39A10 10 0 1 1 12 22zm5.16-7.38c-.28-.14-1.66-.82-1.92-.91s-.45-.14-.64.14-.74.91-.9 1.1-.33.21-.6.07a8.02 8.02 0 0 1-2.36-1.46 8.76 8.76 0 0 1-1.62-2c-.17-.29 0-.44.13-.59.14-.14.29-.33.44-.5.14-.17.19-.29.29-.48.1-.19.05-.36 0-.5s-.64-1.53-.88-2.1c-.23-.55-.47-.47-.64-.48l-.55-.01c-.19 0-.5.07-.76.36a3.17 3.17 0 0 0-.96 2.36c0 1.39.99 2.73 1.13 2.92.14.19 1.94 3.06 4.72 4.29.66.29 1.17.46 1.57.59.66.21 1.26.18 1.74.11.53-.08 1.66-.68 1.9-1.34.24-.65.24-1.2.17-1.32-.07-.12-.25-.18-.53-.32z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => openDenyModal(form.id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-tertiary"
                              >
                                Recusar
                              </button>
                              <button
                                onClick={() => handleAccept(form)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-tertiary"
                              >
                                Aceitar
                              </button>
                            </div>
                          )}
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
