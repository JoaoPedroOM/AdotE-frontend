import { Organizacao } from './organizacao';
import {Fotos} from "./fotos"

export interface Animal {
  id: number;
  nome: string;
  sexo: "MACHO" | "FÊMEA";
  porte: "PEQUENO" | "MÉDIO" | "GRANDE";
  vacinado: boolean;
  organizacao: Organizacao;
  fotos: Fotos[];
}
