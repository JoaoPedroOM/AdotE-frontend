import { z } from "zod";

export const adocaoSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve conter no mínimo 3 caracteres")
    .max(100, "Nome não pode exceder 100 caracteres"),
  
  idade: z.string()
    .refine((value) => {
      const idade = parseInt(value);
      return !isNaN(idade) && idade >= 18 && idade <= 80;
    }, "Idade deve ser um número válido entre 18 e 80"),
  
  cpf: z.string()
    .min(14, "CPF deve estar no formato correto")
    .refine((value) => {
      const numeros = value.replace(/\D/g, '');
      return numeros.length === 11;
    }, "CPF deve conter 11 dígitos numéricos"),
  
  telefone: z.string()
    .min(15, "Telefone deve estar no formato correto")
    .refine((value) => {
      const numeros = value.replace(/\D/g, '');
      return numeros.length == 11;
    }, "Telefone deve conter 11 dígitos numéricos"),
  
  email: z.string()
    .email("E-mail inválido")
    .min(5, "E-mail deve ter pelo menos 5 caracteres")
    .max(100, "E-mail não pode exceder 120 caracteres"),
  
  respostas: z.record(z.string().min(1, "Esta resposta é obrigatória"))
    .refine((respostas) => {
      return Object.keys(respostas).length > 0;
    }, "É necessário responder todas as perguntas do formulário")
});

export type AdocaoFormValues = z.infer<typeof adocaoSchema>;