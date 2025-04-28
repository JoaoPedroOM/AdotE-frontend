import { useState } from 'react';

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

export default function FormularioRespostas({ respostas }: FormularioRespostasProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const toggleExpand = (id: number) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-4 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 font-tertiary text-lg mb-2">
        Informações do Formulário
      </h4>
      
      <div className="space-y-3">
        {respostas.map((resposta) => {
          const isExpanded = expanded[resposta.id] || false;
          const isLongResponse = resposta.resposta.length > 120;
          
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
                    ? resposta.resposta.substring(0, 120) + '...' 
                    : resposta.resposta}
                </p>
                
                {isLongResponse && (
                  <button 
                    onClick={() => toggleExpand(resposta.id)}
                    className="text-orange-600 hover:text-orange-800 text-sm mt-2 font-medium font-tertiary"
                  >
                    {isExpanded ? 'Ver menos' : 'Ver mais'}
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