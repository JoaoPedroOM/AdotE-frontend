import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useQuery } from "@tanstack/react-query";
import { animalProfile } from "@/services/animalService";
import type { Animal } from "@/models/animal";
import type { Fotos } from "@/models/fotos";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

import logo from "../assets/img/logo2.png";
import { ArrowLeft, MapPin, Share2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import FormularioAdocaoModal from "@/components/FormularioAdocaoModal";

const AnimalProfile = () => {
  const [modalAberto, setModalAberto] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { id } = useParams();
  
  const location = useLocation();
  const previousLocation = location.state?.from || "/adote";
  const animalId = Number(id);

  const {
    data: animal = {} as Animal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["animal", id],
    queryFn: () => animalProfile(animalId),
  });

  useEffect(() => {
    const extrairUrls = () => {
      if (animal.fotos && Array.isArray(animal.fotos)) {
        const urls = animal.fotos.map((foto: Fotos) => foto.url);
        setImageUrls(urls);
      }
    };

    extrairUrls();
  }, [animalId, animal.fotos]);

  const handleShare = (platform: string) => {
    if (!animal) return;
    const currentUrl = window.location.href;
    const shareText = encodeURIComponent(
      `Conheça ${animal.nome}, um ${animal.tipo} para adoção!`
    );

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${animal.nome}&summary=${shareText}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${shareText} ${currentUrl}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const currentUrl = window.location.href;

  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Helmet>
          <title>
          AdotE | Perfil do Animal
          </title>
          <meta
            name="description"
            content={animal?.descricao || "Conheça este animal para adoção."}
          />

          {/* Facebook Open Graph Tags */}
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`AdotE | ${animal?.nome}` || "AdotE | Perfil do Animal"}
          />
          <meta
            property="og:description"
            content={animal?.descricao || "Conheça este animal para adoção."}
          />
          <meta
            property="og:image"
            content={selectedImage || imageUrls[0] || ""}
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:site_name" content="AdotE" />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={`AdotE | ${animal?.nome}` || "AdotE | Perfil do Animal"}
          />
          <meta
            name="twitter:description"
            content={animal?.descricao || "Conheça este animal para adoção."}
          />
          <meta
            name="twitter:image"
            content={selectedImage || imageUrls[0] || ""}
          />

          {/* WhatsApp Preview Tags */}
          <meta
            property="og:image:secure_url"
            content={selectedImage || imageUrls[0] || ""}
          />
          <meta property="og:locale" content="pt_BR" />
        </Helmet>

        <Navbar />
        <main className="p-4 mx-auto max-w-[1200px]">
          <div className="flex items-center justify-between">
            <Link
              to={previousLocation}
              className="flex items-center gap-2 hover:bg-orange-300 hover:text-neutral-900 px-4 py-2 rounded-md font-tertiary"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-[999]">
                  <DropdownMenuItem
                    onClick={() => handleShare("facebook")}
                    className="cursor-pointer"
                  >
                    <FaFacebook className="h-4 w-4 mr-2" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShare("twitter")}
                    className="cursor-pointer"
                  >
                    <FaTwitter className="h-4 w-4 mr-2" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShare("whatsapp")}
                    className="cursor-pointer"
                  >
                    <FaWhatsapp className="h-4 w-4 mr-2" />
                    WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Condicional para erro */}
          {error ? (
            <div className="flex items-center justify-center bg-red-50 border border-red-300 p-4 rounded-lg mt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8 text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01M21 12c0 4.972-4.029 9-9 9s-9-4.028-9-9 4.029-9 9-9 9 4.028 9 9z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-red-600 font-medium text-lg font-main">
                    Oops! Algo deu errado.
                  </p>
                  <p className="text-red-500 mt-2 font-tertiary">
                    Não conseguimos carregar os dados do animal. Tente novamente
                    mais tarde.
                  </p>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
              {/* Imagem */}
              <div className="space-y-4">
                <Skeleton className="h-[520px] w-full rounded-lg shadow-sm" />
              </div>

              {/* Dados */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-[45px] w-1/2 rounded-lg shadow-sm" />
                  </div>

                  <div className="flex items-center mb-4 font-tertiary">
                    <Skeleton className="h-[45px] w-1/2 rounded-lg shadow-sm" />
                  </div>

                  {/* Badge */}
                  <div className="flex gap-2 mb-6">
                    <Skeleton className="h-[25px] w-full rounded-full shadow-sm" />
                    <Skeleton className="h-[25px] w-full rounded-full shadow-sm" />
                    <Skeleton className="h-[25px] w-full rounded-full shadow-sm" />
                    <Skeleton className="h-[25px] w-full rounded-full shadow-sm" />
                    <Skeleton className="h-[25px] w-full rounded-full shadow-sm" />
                  </div>
                </div>

                <div>
                  {/* Sobre */}
                  <Skeleton className="h-[45px] w-1/2 rounded-lg shadow-sm" />
                  {/* Descrição */}
                  <Skeleton className="h-[150px] w-full rounded-lg shadow-sm mt-5" />
                </div>

                {/* Contato */}
                <div className="space-y-3">
                  <Skeleton className="h-[45px] w-full rounded-lg shadow-sm" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
              {/* Coluna de imagens */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl border">
                  <img
                    src={selectedImage || imageUrls[0]}
                    alt={animal.nome}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 w-10">
                    <img src={logo} alt="Logo" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {imageUrls.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-square overflow-hidden rounded-md border cursor-pointer ${
                        selectedImage === image ? "ring-2 ring-orange-300" : ""
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt="fofão"
                        className="object-cover w-full h-full hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna de descrição */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold font-main">
                      {animal.nome}
                    </h1>
                  </div>

                  <div className="flex items-center mb-4 font-tertiary">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{animal.organizacao.endereco.cidade}, {animal.organizacao.endereco.estado}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 font-tertiary">
                    <Badge variant="outline">
                      {capitalizeFirstLetter(animal.idade)}
                    </Badge>
                    <Badge variant="outline">
                      {capitalizeFirstLetter(animal.porte)}
                    </Badge>
                    <Badge variant="outline">
                      {capitalizeFirstLetter(animal.sexo)}
                    </Badge>
                    <Badge variant="outline">
                      {animal.vacinado ? "Vacinada" : "Não vacinado"}
                    </Badge>
                    <Badge variant="outline">
                      {animal.castrado ? "Castrado" : "Não castrado"}
                    </Badge>
                    <Badge variant="outline">
                      {animal.vermifugado ? "Vermifugado" : "Não vermifugado"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2 font-main">
                    Sobre {animal.nome}
                  </h2>
                  <p className="font-tertiary">{animal.descricao}</p>
                </div>

                <div className="pt-4 space-y-4">
                  <Button className="w-full py-5 text-[#fff] bg-orange-500 hover:bg-orange-600"   onClick={() => setModalAberto(true)}>
                    Quero Adotar
                  </Button>
                  <FormularioAdocaoModal open={modalAberto} onClose={() => setModalAberto(false)} animalId={animal.id} organizacaoId={animal.organizacao.id} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnimalProfile;
