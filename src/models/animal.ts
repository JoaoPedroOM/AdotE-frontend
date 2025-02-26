import { Organizacao } from './organizacao';

export interface Animal {
  nome: string;
  sexo: "MACHO" | "FÊMEA";
  porte: "PEQUENO" | "MÉDIO" | "GRANDE";
  vacinado: boolean;
  organizacao: Organizacao;
}
