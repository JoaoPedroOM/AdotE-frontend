import { useState } from "react";

interface Resposta {
  id: number;
  pergunta: string;
  resposta: string;
}

interface FormularioRespostasProps {
  respostas: Resposta[];
}

interface ExpandedState {
  [key: number]: boolean;
}

interface CondicionalConfig {
  dependeDe: string;
  mostrarSe: string[];
}

interface PerguntasCondicionaisType {
  [key: string]: CondicionalConfig;
}

// Mapeamento de perguntas e suas dependências
const PERGUNTAS_CONDICIONAIS: PerguntasCondicionaisType = {
  "Sua casa possui quintal com muros e portões altos?": {
    dependeDe: "Qual o tipo da sua residência?",
    mostrarSe: ["Casa"],
  },
  "Caso você more em casa, há possibilidade de mudança para apartamento?": {
    dependeDe: "Qual o tipo da sua residência?",
    mostrarSe: ["Casa"],
  },
  "Se sim, o que acontecerá com o animal?": {
    dependeDe:
      "Caso você more em casa, há possibilidade de mudança para apartamento?",
    mostrarSe: ["Sim"],
  },
  "Se sim, quantos animais você tem? Quais espécies/raças? Estão castrados?": {
    dependeDe: "Você já tem outros animais?",
    mostrarSe: ["Sim"],
  },
  "Se não, com quem você mora?": {
    dependeDe: "Você mora sozinho?",
    mostrarSe: ["Não"],
  },
};

export default function FormularioRespostas({
  respostas,
}: FormularioRespostasProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const respostasPorPergunta = respostas.reduce((acc, item) => {
    acc[item.pergunta] = item.resposta;
    return acc;
  }, {} as Record<string, string>);

  const deveExibirPergunta = (pergunta: string): boolean => {
    const condicional = PERGUNTAS_CONDICIONAIS[pergunta];

    if (!condicional) return true;

    const respostaDependencia = respostasPorPergunta[condicional.dependeDe];

    return condicional.mostrarSe.includes(respostaDependencia);
  };

  const respostasFiltradas = respostas.filter((resposta) =>
    deveExibirPergunta(resposta.pergunta)
  );

  return (
    <div className="space-y-4 rounded-lg md:p-4 px-1 py-4">
      <h4 className="font-semibold text-gray-900 font-tertiary md:text-lg text-base mb-2">
        Informações do Formulário
      </h4>

      <div className="space-y-3">
        {respostasFiltradas.map((resposta) => {
          const isExpanded = expanded[resposta.id] || false;
          const isLongResponse = resposta.resposta.length > 120;
          if (
            resposta.resposta === "Não" &&
            Object.keys(PERGUNTAS_CONDICIONAIS).includes(resposta.pergunta)
          ) {
            return null;
          }

          return (
            <div
              key={resposta.id}
              className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden"
            >
              <div className="p-3 bg-orange-50 border-b border-gray-100">
                <h5 className="font-medium text-gray-800 font-tertiary">
                  {resposta.pergunta}
                </h5>
              </div>

              <div className="p-3">
                <p className="text-gray-700 whitespace-pre-wrap font-tertiary">
                  {isLongResponse && !isExpanded
                    ? resposta.resposta.substring(0, 120) + "..."
                    : resposta.resposta}
                </p>

                {isLongResponse && (
                  <button
                    onClick={() => toggleExpand(resposta.id)}
                    className="text-orange-600 hover:text-orange-800 text-sm mt-2 font-medium font-tertiary"
                  >
                    {isExpanded ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}