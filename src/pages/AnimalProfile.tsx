import Navbar from "@/components/global/Navbar";
import logo from "../assets/img/logo2.png"
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Share2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const AnimalProfile = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const petImages = [
    "https://images.unsplash.com/photo-1612160609504-334bdc6b70c9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600077029182-92ac8906f9a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Navbar />
        <main className="p-4 mx-auto max-w-[1200px]">
          {/* Voltar e compartilhar */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
            {/* Coluna de imagens */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-xl border">
                <img
                  src={selectedImage || petImages[0]}
                  alt="Lindão"
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 right-4 w-10">
                  <img src={logo} alt="Logo" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {petImages.map((image, index) => (
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
                  <h1 className="text-3xl font-bold font-main">Rex 2.3</h1>
                </div>
                
                <div className="flex items-center mb-4 font-tertiary">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Santos, SP</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 font-tertiary">
                  <Badge variant="outline">Filhote</Badge>
                  <Badge variant="outline">Grande</Badge>
                  <Badge variant="outline">Macho</Badge>
                  <Badge variant="outline">Vacinado</Badge>
                  <Badge variant="outline">Castrado</Badge>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 font-main">Sobre Rex</h2>
                <p className="font-tertiary">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla cum repellat qui impedit, ipsam minus. Nostrum excepturi accusamus, magnam eius ducimus praesentium sapiente laboriosam fuga sunt modi dolorum ipsam aspernatur.
                </p>
              </div>

              <div className="pt-4 space-y-4">
                <Button className="w-full bg-orange-400 hover:bg-orange-500">Quero Adotar</Button>
                <Button variant="outline" className="w-full">Entre em Contato</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnimalProfile;