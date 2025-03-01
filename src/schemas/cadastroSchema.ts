import { z } from "zod";

export const animalSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"), 
  sexo: z.enum(["Macho", "Femea"], { errorMap: () => ({ message: "O sexo é obrigatório" }) }),
  porte: z.enum(["Pequeno", "Medio", "Grande"], { errorMap: () => ({ message: "O porte é obrigatório" }) }),
  vacinado: z.boolean().optional(),
  localizacao: z.string().optional(),
  abrigo: z.string().optional(),
  fotos: z.any()
  .refine(files => files?.length >= 1, "Pelo menos uma foto é obrigatória")
  .refine(files => files?.length <= 3, "No máximo 3 fotos são permitidas")
});

export type AnimalFormValues = z.infer<typeof animalSchema>;
