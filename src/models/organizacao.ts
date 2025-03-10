export interface Endereco {
  id: number;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
}

export interface Organizacao {
  id: number;
  nome: string;
  numero: string;
  cnpj: string;
  endereco: Endereco;  
  email: string;
}
