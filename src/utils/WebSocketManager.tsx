import { useWebSocketNotification } from "@/hooks/useWebSocketForms";

export function WebSocketManager() {
  useWebSocketNotification();
  return null;
}
