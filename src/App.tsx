import { Helmet } from "react-helmet";
import Navbar from "./components/global/Navbar";
import pata from "./assets/img/paw.png";
import Card from "./components/Card";
import Hero from "./components/Hero";

import banner1 from "./assets/img/banner1.avif";
import banner3 from "./assets/img/banner3.avif";
import banner4 from "./assets/img/banner4.avif";

const App = () => {
  return (
    <div className="relative w-full">
      <div className="page_texture" />
      <div className="fundo_inicio" />
      <div className="fundo_vinheta" />

      <Helmet>
        <title>AdotE</title>
        <meta
          name="description"
          content="Encontre animais para adoção em sua região e ajude a dar um lar para quem precisa. Conheça nossos animais disponíveis e faça a diferença."
        />
        {/* Facebook Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="AdotE | Encontre o Animal Perfeito para Adoção"
        />
        <meta
          property="og:description"
          content="Encontre animais para adoção em sua região e ajude a dar um lar para quem precisa. Conheça nossos animais disponíveis e faça a diferença."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/4RmPy5f3/homeHero.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://adot-e.vercel.app/" />
        <meta property="og:site_name" content="AdotE" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="AdotE | Encontre o Animal Perfeito para Adoção"
        />
        <meta
          name="twitter:description"
          content="Encontre animais para adoção em sua região e ajude a dar um lar para quem precisa. Conheça nossos animais disponíveis e faça a diferença."
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/4RmPy5f3/homeHero.png"
        />
      </Helmet>

      <img
        src={pata}
        alt="Detalhe decorativo"
        className="absolute lg:z-[200] z-[200] opacity-70 pointer-events-none transform -rotate-12 lg:top-10"
      />

      <img
        src={pata}
        alt="Detalhe decorativo"
        className="absolute z-[100] opacity-70 pointer-events-none transform -rotate-12 bottom-0 right-0"
      />

      <div className="content-layer">
        <Navbar />
        <Hero />
        <section
          className="flex flex-col items-center justify-center w-full md:h-screen min-h-[50vh] py-8 md:py-0 mt-[30vh]"
          id="sobre"
        >
          <Card
            title="Encontre o Melhor Amigo Para a Vida Toda"
            description="Adotar um animal é uma experiência transformadora. Eles não só ganham um lar, mas também oferecem amor incondicional. Dê uma chance a um novo começo para um amigo peludo que está esperando por você!"
            imageUrl={banner1}
            buttonTitle="Encontre seu amigo"
            buttonPath="/adote"
            imagePosition="left"
          />
        </section>
        <section className="flex flex-col items-center justify-center w-full md:h-screen min-h-[50vh] py-8 md:py-0">
          <Card
            title="Conecte-se Com Adoções Responsáveis"
            description="Nossa plataforma une você a abrigos e ONGs que cuidam de animais em busca de um lar. Descubra perfis completos de animais disponíveis para adoção e dê o próximo passo para uma mudança de vida."
            imageUrl="https://plus.unsplash.com/premium_photo-1686090449483-89a9b794e7cf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            buttonTitle="Adote Agora"
            buttonPath="/adote"
            imagePosition="right"
          />
        </section>
        <section className="flex flex-col items-center justify-center w-full md:h-screen min-h-[50vh] py-8 md:py-0">
          <Card
            title="Encontre Seu Companheiro Ideal em Um Clique"
            description="Com a nossa plataforma, você tem acesso aos perfis detalhados de animais resgatados. Selecione o que mais combina com sua família e entre em contato diretamente com o abrigo para iniciar o processo de adoção."
            imageUrl={banner3}
            buttonTitle="Adote Agora"
            buttonPath="/adote"
            imagePosition="left"
          />
        </section>
        <section className="flex flex-col items-center justify-center w-full md:h-screen min-h-[50vh] py-8 md:py-0">
          <Card
            title="Adote com Transparência e Amor"
            description="Nossos abrigos e ONGs cadastrados oferecem informações completas sobre cada animal resgatado, para que você possa fazer uma escolha informada e cheia de carinho. Dê uma nova chance a um amigo peludo!"
            imageUrl={banner4}
            buttonTitle="Encontre um pet"
            buttonPath="/adote"
            imagePosition="right"
          />
        </section>
      </div>
    </div>
  );
};

export default App;
