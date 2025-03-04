import Navbar from "@/components/global/Navbar";
import logo from "../assets/img/logo2.png";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { animalProfile } from "@/services/animalService";
import type { Animal } from "@/models/animal";
import type { Fotos } from "@/models/fotos";
import { Skeleton } from "@/components/ui/skeleton";
import { consultarCep } from "@/utils/consultarCep";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const AnimalProfile = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { id } = useParams();

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
    const buscarLocalizacao = async () => {
      if (animal?.organizacao?.cep) {
        try {
          const dados = await consultarCep(animal.organizacao.cep);
          if (dados) {
            setLocalizacao(`${dados.cidade}, ${dados.estado}`);
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          setLocalizacao("Localização não disponível");
        }
      }
    };

    const extrairUrls = () => {
      if (animal.fotos && Array.isArray(animal.fotos)) {
        const urls = animal.fotos.map((foto: Fotos) => foto.url);
        setImageUrls(urls);
      }
    };

    buscarLocalizacao();
    extrairUrls();
  }, [animalId, animal.fotos]);

  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Navbar />
        <main className="p-4 mx-auto max-w-[1200px]">
          <div className="flex items-center justify-between">
            <Link
              to="/adote"
              className="flex items-center gap-2 hover:bg-orange-300 hover:text-neutral-900 px-4 py-2 rounded-md font-tertiary"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
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
                    <span>{localizacao || "Localização não disponível"}</span>
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
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2 font-main">
                    Sobre {animal.nome}
                  </h2>
                  <p className="font-tertiary">{animal.descricao}</p>
                </div>

                <div className="pt-4 space-y-4">
                  <Button className="w-full bg-orange-400 hover:bg-orange-500">
                    Quero Adotar
                  </Button>
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
