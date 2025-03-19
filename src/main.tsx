import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import { Routes } from "./routes/index";
import { Analytics } from "@vercel/analytics/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "dark",
      isNameRequired: true,
      isEmailRequired: true,
      formTitle: "Relatar Erro",
      submitButtonLabel: "Enviar Relatório",
      cancelButtonLabel: "Cancelar",
      nameLabel: "Nome",
      emailLabel: "E-mail",
      messageLabel: "O que aconteceu?",
      namePlaceholder: "Seu nome",
      emailPlaceholder: "seu.email@exemplo.com",
      messagePlaceholder: "Descreva o problema que ocorreu...",
      successMessageText: "Relatório enviado com sucesso!",
    }),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/api-adot-e\.vercel\.app/],
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
    <Analytics />
  </StrictMode>
);
