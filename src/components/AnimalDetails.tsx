import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageSwiper } from "../components/ui/image-swiper";
import { twMerge } from "tailwind-merge";
import { Card, CardContent } from "../components/ui/card";
import animais from "../Mock/animais";
import { Link } from "react-router";

import { MessageSquare, PawPrint, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const AnimalDetails = () => {
  return (
    <Tabs defaultValue="animals">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="animals">
          <PawPrint className="w-4 h-4 mr-2" />
          Animais
        </TabsTrigger>
        <TabsTrigger value="messages">
          <MessageSquare className="w-4 h-4 mr-2" />
          Mensagens
        </TabsTrigger>
      </TabsList>

      <TabsContent value="animals">
        <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {/* Map para criação de cards para todos animais */}
          {animais.map((animal, index) => (
            <Card
              className="text-neutral-900 rounded-lg shadow-lg overflow-hidden max-w-[350px]"
              key={index}
            >
              <div className="max-w-[400px] mx-auto">
                <ImageSwiper images={animal.fotos} />
              </div>
              <CardContent className="p-4">
                <Link to={`/animal/${index}`}>
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
                      <Button variant="default">Editar</Button>
                    </div>
                        <h2
                          className={twMerge(
                            "font-normal text-base font-tertiary text-gray-700 mb-2"
                          )}
                        >
                          {animal.localizacao}
                        </h2>
                     
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {" "}
                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                        {animal.sexo}
                      </Badge>
                      <Badge variant="secondary">
                        <Heart className="w-4 h-4 mr-1 text-green-500" />
                        {animal.vacinado ? "Vacinado" : "Não Vacinado"}
                      </Badge>
                      <Badge variant="secondary">
                        <Heart className="w-4 h-4 mr-1 text-blue-500" />
                        Pequeno
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">
                      <strong>Abrigo:</strong> {animal.abrigo}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnimalDetails;
