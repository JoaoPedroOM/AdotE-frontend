import { useEffect, useState } from "react";
import type { Animal } from "@/models/animal";

import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { twMerge } from "tailwind-merge";

import FormEdit from "./FormEdit";

import { Card, CardContent } from "../components/ui/card";
import { Badge } from "./ui/badge";
import { Heart } from "lucide-react";
import { ImageSwiper } from "../components/ui/image-swiper";
// import { Link } from "react-router";


const OrganizationAnimalCard = ({ animal }: { animal: Animal }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const extrairUrls = () => {
      const urls = animal.fotos.map(foto => foto.url);
      setImageUrls(urls);
    };
    extrairUrls();
  }, [animal]);

  return (
    <Card
    className="text-neutral-900 rounded-lg shadow-lg overflow-hidden max-w-[350px]"
  >
    <div className="max-w-[400px] mx-auto">
      <ImageSwiper images={imageUrls} />
    </div>
    <CardContent className="p-4">
        <div className="mt-4">
          <div className="flex justify-between">
            <>
              <h2
                className={twMerge(
                  "font-normal text-2xl text-gray-800 font-main"
                )}
              >
                {animal.nome}
              </h2>
            </>
            {/* Abre formulario com as informações do card para editar */}
              <FormEdit key={animal?.id} animal={animal}/>
          </div>
          <h2
            className={twMerge(
              "font-normal text-base font-tertiary text-gray-700 mb-2"
            )}
          >
            {animal.organizacao.endereco.cidade}, {animal.organizacao.endereco.estado}
          </h2>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {" "}
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              {capitalizeFirstLetter(animal.sexo)}
            </Badge>
            <Badge variant="secondary">
              <Heart className="w-4 h-4 mr-1 text-green-500" />
              {animal.vacinado ? "Vacinado" : "Não Vacinado"}
            </Badge>
            <Badge variant="secondary">
              <Heart className="w-4 h-4 mr-1 text-blue-500" />
              {capitalizeFirstLetter(animal.porte)}
            </Badge>
          </div>
          <p className="text-sm text-gray-800 mt-2">
            <strong>Abrigo:</strong> {animal.organizacao.nome}
          </p>
        </div>
    </CardContent>
  </Card>
  );
};

export default OrganizationAnimalCard;
