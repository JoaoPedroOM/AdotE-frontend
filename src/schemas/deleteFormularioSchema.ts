import { z } from "zod";

export const motivoSchema = z.object({
    justificativa: z
      .string()
      .min(100, "A justificativa precisa ter pelo menos 100 caracteres.")
      .max(300, "A justificativa não pode exceder 300 caracteres."),
  });
  
export type MotivoFormValues = z.infer<typeof motivoSchema>;
  