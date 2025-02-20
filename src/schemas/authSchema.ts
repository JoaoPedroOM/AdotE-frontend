import { z } from "zod";

const baseAuthSchema = z.object({
  email: z
    .string()
    .email("O e-mail precisa ser válido")
    .min(1, "O e-mail é obrigatório"),
  password: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres")
    .min(1, "A senha é obrigatória"),
});

export const loginSchema = baseAuthSchema;

export const registerSchema = baseAuthSchema
  .extend({
    organizationName: z.string().min(1, "O nome da organização é obrigatório"),
    phone: z.string().length(15, "O telefone precisa ser válido"),
    cep: z.string().length(9, "O CEP precisa ser válido"),
    cnpj: z.string().length(18, "O CNPJ precisa ser válido"),
  })

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
