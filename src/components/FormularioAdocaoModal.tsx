import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { obterPerguntas } from "../services/animalService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { InputMask } from "@react-input/mask";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import {
  AdocaoFormValues,
  adocaoSchema,
} from "@/schemas/formularioAdocaoSchema";
import { useAnimal } from "@/hooks/useAnimal";

interface FormularioAdocaoModalProps {
  open: boolean;
  onClose: () => void;
  animalId?: number;
  organizacaoId?: number;
}
interface RespostaEnvio {
  idPergunta: number;
  resposta: string;
}

interface FormularioEnvio {
  idAnimal: number;
  idOrganizacao: number;
  nomeAdotante: string;
  email: string;
  idade: number;
  telefone: string;
  cpf: string;
  respostas: RespostaEnvio[];
}

const FormularioAdocaoModal: React.FC<FormularioAdocaoModalProps> = ({
  open,
  onClose,
  animalId,
  organizacaoId,
}) => {
  const { envioFormulario, error } = useAnimal();

  const [respostas, setRespostas] = useState<Record<string | number, string>>(
    {}
  );

  const [initialSetupDone, setInitialSetupDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<AdocaoFormValues>({
    resolver: zodResolver(adocaoSchema),
    defaultValues: {
      nome: "",
      idade: "",
      cpf: "",
      telefone: "",
      email: "",
      respostas: {},
    },
  });

  const opcoesPerguntas: Record<number, string[]> = {
    3: ["Trabalha", "Estuda", "Trabalha e estuda", "Desempregado", "Outros"],
    4: ["Sim", "Não"],
    5: ["Casa", "Apartamento", "Sítio"],
    6: ["Sim", "Não"],
    7: ["Dentro de casa", "Solto no quintal", "Preso na corrente"],
    8: ["Sim", "Não"],
    11: ["Sim", "Não"],
    12: ["Sim", "Não"],
    14: ["Sim", "Não"],
    17: ["Sim", "Não"],
    18: ["Sim", "Não"],
    19: ["Sim"],
  };

  const perguntasCondicionais: Record<
    number,
    { dependeDe: number; valorEsperado: string }
  > = {
    6: { dependeDe: 5, valorEsperado: "Casa" },
    8: { dependeDe: 5, valorEsperado: "Casa" },
    9: { dependeDe: 8, valorEsperado: "Sim" },
    13: { dependeDe: 12, valorEsperado: "Sim" },
    15: { dependeDe: 14, valorEsperado: "Não" },
  };

  const podeExibirPergunta = (perguntaId: number) => {
    const condicional = perguntasCondicionais[perguntaId];
    if (!condicional) return true;
    const respostaAnterior = respostas[condicional.dependeDe];
    return respostaAnterior === condicional.valorEsperado;
  };

  const {
    data: perguntas = [],
    isLoading: perguntaLoading,
    isError: perguntaError,
  } = useQuery({
    queryKey: ["perguntas"],
    queryFn: () => obterPerguntas(),
  });

  useEffect(() => {
    if (perguntas.length > 0 && !initialSetupDone) {
      perguntas.forEach((pergunta: any) => {
        register(`respostas.${pergunta.id}`, {
          required: "Esta pergunta é obrigatória",
        });
      });

      const updatedRespostas = { ...respostas };
      let respostasUpdated = false;

      perguntas.forEach((pergunta: any) => {
        if (
          perguntasCondicionais[pergunta.id] &&
          !updatedRespostas[pergunta.id]
        ) {
          updatedRespostas[pergunta.id] = "Não";
          setValue(`respostas.${pergunta.id}`, "Não", {
            shouldValidate: false,
          });
          respostasUpdated = true;
        }
      });

      if (respostasUpdated) {
        setRespostas(updatedRespostas);
      }

      setInitialSetupDone(true);
    }
  }, [perguntas, register, setValue, initialSetupDone, respostas]);

  const handleRespostaChange = (perguntaId: number, resposta: string) => {
    const newRespostas = { ...respostas, [perguntaId]: resposta };

    Object.entries(perguntasCondicionais).forEach(
      ([condPerguntaId, condicao]) => {
        const condPerguntaIdNum = Number(condPerguntaId);

        if (condicao.dependeDe === perguntaId) {
          if (resposta !== condicao.valorEsperado) {
            newRespostas[condPerguntaIdNum] = "Não";
            setValue(`respostas.${condPerguntaIdNum}`, "Não", {
              shouldValidate: false,
            });
          }
        }
      }
    );

    setRespostas(newRespostas);

    setValue(`respostas.${perguntaId}`, resposta, {
      shouldValidate: true,
    });

    trigger(`respostas.${perguntaId}`);
  };

  const formatarRespostasParaEnvio = (
    respostasObj: Record<string | number, string>
  ): Array<{ idPergunta: number; resposta: string }> => {
    return Object.entries(respostasObj)
      .filter(([_, resposta]) => resposta !== "")
      .map(([idStr, resposta]) => ({
        idPergunta: Number(idStr),
        resposta: resposta,
      }));
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const respostasCompletas = { ...respostas };

      perguntas.forEach((pergunta: any) => {
        if (!respostasCompletas[pergunta.id]) {
          respostasCompletas[pergunta.id] = podeExibirPergunta(pergunta.id)
            ? ""
            : "Não";
        }
      });

      const respostasFormatadas =
        formatarRespostasParaEnvio(respostasCompletas);

      const dadosEnvio: FormularioEnvio = {
        idAnimal: animalId || 0,
        idOrganizacao: organizacaoId || 0,
        nomeAdotante: data.nome,
        email: data.email,
        idade: Number(data.idade),
        telefone: data.telefone,
        cpf: data.cpf,
        respostas: respostasFormatadas,
      };

      await envioFormulario(dadosEnvio);

      toast.success("Formulário enviado com sucesso!", {
        description:
          "Entraremos em contato em breve para prosseguir com a adoção.",
      });

      reset();
      setRespostas({});
      setInitialSetupDone(false);
      onClose();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao enviar formulário", {
        description: "Por favor, tente novamente mais tarde.",
      });
      setErrorMessage(error + " ❌");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="z-[999] max-w-[850px] w-full mx-auto px-5 py-3 bg-orange-50 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-orange-600 text-center mt-4 flex items-center justify-center">
            <span className="font-main tracking-[1px]">
              Formulário de Adoção
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {perguntaLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-orange-600">Carregando perguntas...</p>
          </div>
        )}

        {/* Erro */}
        {perguntaError && (
          <div className="text-center py-6 text-red-500">
            <svg
              className="w-12 h-12 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Oops! Erro ao carregar perguntas.</p>
            <button
              type="button"
              className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-md"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!perguntaLoading && !perguntaError && (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200">
              <label className="font-medium text-gray-800 block mb-3 items-center font-tertiary">
                Nome completo: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nome completo"
                className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 font-tertiary"
                {...register("nome")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="nome" />
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200">
              <label className="font-medium text-gray-800 block mb-3 items-center font-tertiary">
                Idade: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Idade"
                min="21"
                max="80"
                className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 font-tertiary"
                {...register("idade")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="idade" />
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200">
              <label className="font-medium text-gray-800 block mb-3 items-center font-tertiary">
                Seu CPF: <span className="text-red-500">*</span>
              </label>
              <InputMask
                mask="___.___.___-__"
                replacement={{ _: /\d/ }}
                placeholder="000.000.000-00"
                className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 font-tertiary"
                {...register("cpf")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="cpf" />
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200">
              <label className="font-medium text-gray-800 block mb-3 items-center font-tertiary">
                Seu telefone: <span className="text-red-500">*</span>
              </label>
              <InputMask
                mask="(__) _____-____"
                replacement={{ _: /\d/ }}
                placeholder="(00) 00000-0000"
                className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 font-tertiary"
                {...register("telefone")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="telefone" />
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200">
              <label className="font-medium text-gray-800 block mb-3 items-center font-tertiary">
                Seu e-mail: <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="E-mail"
                className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 font-tertiary"
                {...register("email")}
              />
              <p className="text-xs font-semibold text-red-700 mt-1">
                <ErrorMessage errors={errors} name="email" />
              </p>
            </div>

            {perguntas.map((pergunta: any) => {
              if (!podeExibirPergunta(pergunta.id)) {
                return null;
              }

              return (
                <div
                  key={pergunta.id}
                  className="bg-white p-4 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <label className="font-medium text-gray-800 block mb-3 items-center font-tertiary">
                    {pergunta.pergunta} <span className="text-red-500">*</span>
                  </label>

                  {pergunta.tipo === "ALTERNATIVA" ? (
                    <div className="flex flex-col gap-2">
                      {opcoesPerguntas[pergunta.id]?.map((opcao) => (
                        <label
                          key={opcao}
                          className="flex items-center gap-2 font-tertiary"
                        >
                          <input
                            type="radio"
                            name={`pergunta-${pergunta.id}`}
                            value={opcao}
                            className="w-4 h-4 text-orange-600"
                            onChange={(e) =>
                              handleRespostaChange(pergunta.id, e.target.value)
                            }
                            checked={respostas[pergunta.id] === opcao}
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      name={`pergunta-${pergunta.id}`}
                      value={respostas[pergunta.id] || ""}
                      onChange={(e) =>
                        handleRespostaChange(pergunta.id, e.target.value)
                      }
                      className="mt-1 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 font-tertiary"
                      placeholder="Digite sua resposta"
                    />
                  )}
                  <p className="text-xs font-semibold text-red-700 mt-1">
                    <ErrorMessage
                      errors={errors}
                      name={`respostas.${pergunta.id}`}
                    />
                  </p>
                </div>
              );
            })}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
                {error}
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Formulário"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormularioAdocaoModal;
