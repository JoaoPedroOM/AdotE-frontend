import { z } from "zod";

export const animalSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"), 
  tipo: z.enum(["Cachorro", "Gato"], { errorMap: () => ({ message: "O tipo é obrigatório" }) }),
  idade: z.enum(["Filhote", "Jovem", "Adulto", "Idoso"], { errorMap: () => ({ message: "A idade é obrigatória" }) }),
  sexo: z.enum(["Macho", "Femea"], { errorMap: () => ({ message: "O sexo é obrigatório" }) }),
  porte: z.enum(["Pequeno", "Medio", "Grande"], { errorMap: () => ({ message: "O porte é obrigatório" }) }),
  vacinado: z.boolean().optional(),
  castrado: z.boolean().optional(),
  vermifugado: z.boolean().optional(),
  srd: z.boolean().optional(),
  localizacao: z.string().optional(),
  abrigo: z.string().optional(),
  fotos: z.any()
  .refine(files => files?.length >= 1, "Pelo menos uma foto é obrigatória")
  .refine(files => files?.length <= 3, "No máximo 3 fotos são permitidas"),
  descricao: z.string().min(1, "A descrição é obrigatória").max(620, "A descrição não pode ter mais de 620 caracteres"),
});

export type AnimalFormValues = z.infer<typeof animalSchema>;
