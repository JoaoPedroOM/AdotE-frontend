interface Animal {
    nome: string;
    localizacao: string;
    sexo: "Macho" | "Fêmea";
    vacinado: boolean;
    porte: "Pequeno" | "Médio" | "Grande";
    abrigo: string;
    fotos: string[];
  }
  
  const animais: Animal[] = [
    {
      nome: "Rex",
      localizacao: "São Paulo, SP",
      sexo: "Macho",
      vacinado: true,
      porte: "Médio",
      abrigo: "Aconchego Animal",
      fotos: [
        "https://images.unsplash.com/photo-1512546148165-e50d714a565a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1621757298894-7174d1b1bc40?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1565042081499-89cb1246c819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      nome: "Luna",
      localizacao: "São Paulo, SP",
      sexo: "Fêmea",
      vacinado: false,
      porte: "Pequeno",
      abrigo: "Aconchego Animal",
      fotos: [
        "https://images.unsplash.com/photo-1670748080197-f7cc00a3a7f4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1661869578654-18c40bf2d750?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1676475322745-b2628161648c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      nome: "Bingo",
      localizacao: "São Paulo, SP",
      sexo: "Macho",
      vacinado: true,
      porte: "Grande",
      abrigo: "Aconchego Animal",
      fotos: [
        "https://images.unsplash.com/photo-1605725657590-b2cf0d31b1a5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1613656741959-70b2eaeb6db8?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    }
  ];
  

  export default animais;animais