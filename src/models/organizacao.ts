import { Animal } from "./animal";

export interface Endereco {
  id: number;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
}

export interface ChavePix {
  id: number;
  chave: string;
  tipo: string;
}

export interface Organizacao {
  id: number;
  nome: string;
  numero: string;
  cnpj: string;
  endereco: Endereco;  
  email: string;
  animais?: Animal[];
  chavesPix?: ChavePix[];
}
