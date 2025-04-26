import { z } from "zod";

const pixSchemas = {
  TELEFONE: z.string()
    .min(11, "Telefone inválido (DDD + número)")
    .max(11, "Telefone inválido (DDD + número)")
    .regex(/^\d+$/, "Deve conter apenas números"),

  EMAIL: z.string()
    .email("E-mail inválido"),

  CPF: z.string()
    .length(11, "CPF inválido")
    .regex(/^\d+$/, "Deve conter apenas números"),

  CNPJ: z.string()
    .length(14, "CNPJ inválido")
    .regex(/^\d+$/, "Deve conter apenas números"),

    OUTRO: z.string()
    .length(36, "Chave aleatória PIX deve ter exatamente 36 caracteres")
    .regex(/^[a-fA-F0-9\-]+$/, "Chave PIX inválida, deve ser UUID com hífens"),
  
};

export const organizacaoSchema = z.object({
  tipoChave: z.enum(["TELEFONE", "EMAIL", "CPF", "CNPJ", "OUTRO"]),
  chave: z.string()
}).refine((data) => {
  const schema = pixSchemas[data.tipoChave as keyof typeof pixSchemas];
  return schema.safeParse(data.chave).success;
}, {
  message: "Chave PIX inválida",
  path: ["chave"]
});

export type OrganizacaoFormValues = z.infer<typeof organizacaoSchema>;
