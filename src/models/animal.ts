import { Organizacao } from './organizacao';
import {Fotos} from "./fotos"

export interface Animal {
  id: number;
  nome: string;
  tipo: "CACHORRO" | "GATO";
  sexo: "MACHO" | "FEMEA";
  porte: "PEQUENO" | "MEDIO" | "GRANDE";
  idade: "FILHOTE" | "JOVEM" | "ADULTO" | "IDOSO";
  vacinado: boolean;
  castrado: boolean;
  vermifugado: boolean;
  srd: boolean;
  descricao: string;
  organizacao: Organizacao;
  fotos: Fotos[];
}
