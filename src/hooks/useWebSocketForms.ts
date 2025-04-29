import { useEffect, useState } from "react";
import { Client, Frame, IMessage } from "@stomp/stompjs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error";

export const useWebSocketNotification = (
  baseUrl: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
) => {
  const { organizacao } = useAuthStore();
  const [status, setStatus] = useState<WebSocketStatus>("disconnected");
  const [client, setClient] = useState<Client | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!organizacao?.organizacao_id) {
      console.warn(
        "Organização ID não disponível. WebSocket não será inicializado."
      );
      return;
    }

    const stompClient = new Client({
      brokerURL: `${baseUrl}/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.debug("[WebSocket Debug]:", str);
      },
    });

    stompClient.onConnect = (_frame: Frame) => {
      setStatus("connected");

      const topic = `/topic/ong/${organizacao.organizacao_id}/formulario`;
      stompClient.subscribe(topic, (message: IMessage) => {
        const payload = message.body;

        queryClient.invalidateQueries({
            queryKey: ["animaisForms"] 
        });

        queryClient.invalidateQueries({
            queryKey: ["animalForms"],
          });

        toast.info("Novo formulário de adoção recebido!", {
          description:
            payload || "Um novo formulário de adoção chegou para sua organização.",
          duration: 6000,
        });
      });
    };

    stompClient.onStompError = (frame: Frame) => {
      setStatus("error");
      console.error("[WebSocket] Erro:", frame.headers["message"], frame.body);
      toast.error("Erro ao conectar com notificações em tempo real.");
    };

    stompClient.onWebSocketClose = () => {
      setStatus("disconnected");
    };

    try {
      setStatus("connecting");
      stompClient.activate();
      setClient(stompClient);
    } catch (err) {
      console.error("[WebSocket] Erro ao inicializar:", err);
      setStatus("error");
      toast.error("Falha ao iniciar conexão com notificações.");
    }

    return () => {
      if (stompClient?.active) {
        stompClient.deactivate();
        setStatus("disconnected");
        setClient(null);
      }
    };
  }, [organizacao?.organizacao_id, baseUrl, queryClient]);

  const disconnect = () => {
    if (client?.active) {
      client.deactivate();
      setStatus("disconnected");
      setClient(null);
    }
  };

  return { status, disconnect };
};
