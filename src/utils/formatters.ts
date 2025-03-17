export const formatCNPJ = (cnpj: string): string => {
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  };

  export const formatPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3'
    );
  };
  
  export const formatCEP = (cep: string): string => {
    return cep.replace(
      /(\d{5})(\d{3})/,
      '$1-$2'
    );
  };
  