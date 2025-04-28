import { z } from "zod";

export const motivoSchema = z.object({
    justificativa: z
      .string()
      .min(100, "A justificativa é obrigatória.")
      .max(300, "Máximo de 300 caracteres."),
  });
  
export type MotivoFormValues = z.infer<typeof motivoSchema>;
  