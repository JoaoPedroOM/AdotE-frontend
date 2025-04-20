import { z } from "zod";

export async function validateCEP(cep: string): Promise<boolean> {
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
  cep: z
    .string()
    .length(9, "O CEP precisa ser válido")
    .superRefine(async (cep, ctx) => {
      const isValid = await validateCEP(cep);
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CEP não encontrado",
        });
      }
    }),
  cidade: z.string().min(1, "A cidade é obrigatória"),
  numero: z.string().min(1, "O número é obrigatória"),
  estado: z.string().min(1, "O estado é obrigatório"),
  logradouro: z.string().min(1, "O logradouro é obrigatório"),
  cnpj: z.string().length(18, "O CNPJ precisa ser válido"),
});

export const emailSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório" })
    .email("O e-mail precisa ser válido")
    .min(1, "O e-mail é obrigatório"),
});
export type EmailFormValues = z.infer<typeof emailSchema>;

export const codigoStepSchema = z.object({
  email: z
    .string()
    .email()
    .min(1),
  codigo: z
    .string({ required_error: "O código de verificação é obrigatório" })
    .length(6, "O código de verificação deve ter 6 dígitos")
    .regex(/^\d+$/, "O código de verificação deve conter apenas números"),
});
export type OtpStepFormValues = z.infer<typeof codigoStepSchema>;

export const newPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .min(1),
  password: z
    .string({ required_error: "A senha é obrigatória" })
    .min(6, "A senha precisa ter pelo menos 6 caracteres"),
});
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export type ResetPasswordFormValues = EmailFormValues | OtpStepFormValues | NewPasswordFormValues;

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
