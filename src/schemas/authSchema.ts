import { z } from "zod";

async function validateCEP(cep: string): Promise<boolean> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    return !data.erro;
  } catch {
    return false;
  }
}

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

export const registerSchema = baseAuthSchema.extend({
  organizationName: z.string().min(1, "O nome da organização é obrigatório"),
  phone: z.string().length(15, "O telefone precisa ser válido"),
  cep: z.string().length(9, "O CEP precisa ser válido")
    .superRefine(async (cep, ctx) => {
      const isValid = await validateCEP(cep);
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CEP não encontrado",
        });
      }
    }),
  cnpj: z.string().length(18, "O CNPJ precisa ser válido"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;