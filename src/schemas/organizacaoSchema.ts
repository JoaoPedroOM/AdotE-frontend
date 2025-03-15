import { z } from "zod";

const pixSchemas = {
  Telefone: z.string()
    .min(11, "Telefone inválido (DDD + número)")
    .max(11, "Telefone inválido (DDD + número)")
    .regex(/^\d+$/, "Deve conter apenas números"),
  
  Email: z.string()
    .email("E-mail inválido"),
  
  CPF: z.string()
    .length(11, "CPF inválido")
    .regex(/^\d+$/, "Deve conter apenas números"),
  
  CNPJ: z.string()
    .length(14, "CNPJ inválido")
    .regex(/^\d+$/, "Deve conter apenas números"),
  
  ChaveAleatoria: z.string()
  .length(32, "Chave aleatória PIX deve ter exatamente 32 caracteres")
};

export const organizacaoSchema = z.object({
  tipoChave: z.enum(["Telefone", "Email", "CPF", "CNPJ", "ChaveAleatoria"]),
  chave: z.string()
}).refine((data) => {
  const schema = pixSchemas[data.tipoChave as keyof typeof pixSchemas];
  return schema.safeParse(data.chave).success;
}, {
  message: "Chave PIX inválida",
  path: ["chave"]
});

export type OrganizacaoFormValues = z.infer<typeof organizacaoSchema>;
