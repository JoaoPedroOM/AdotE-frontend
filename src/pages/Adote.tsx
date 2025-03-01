import { Card } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Navbar from "@/components/global/Navbar";
import { Filter, MapPin } from "lucide-react";
import { useState } from "react";

const Adote = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Navbar />
        <main className="p-4 mx-auto max-w-[1200px]">
          <div className="mx-auto w-full flex flex-col items-center justify-center mt-5">
            <h1 className="font-main font-bold leading-[1] text-[#D97706] text-5xl">
              Animais Disponíveis para Adoção
            </h1>
            <p className="font-tertiary">
              Encontre o seu companheiro perfeito entre nossos amiguinhos que
              estão à espera de um lar amoroso.
            </p>
          </div>

          <section className="mt-10">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold font-tertiary">Filtros</div>

              <div className="flex gap-2">
                <Button
                  variant={isFilterOpen ? "secondary" : "outline"}
                  onClick={toggleFilter}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </div>
            </div>
            {isFilterOpen && (
            <Card className="p-4 border rounded-lg shadow-sm fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label
                      htmlFor="location-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Localização
                    </Label>
                    <Select value="" onValueChange={() => {}}>
                      <SelectTrigger id="location-filter" className="w-full z-[500]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Todas as localizações" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="all">
                          Todas as localizações
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="type-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Tipo de Animal
                    </Label>
                    <Select value="" onValueChange={() => {}}>
                      <SelectTrigger id="type-filter" className="w-ful z-[500]l">
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="allTypes">Todos os tipos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="age-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Idade
                    </Label>
                    <Select value="" onValueChange={() => {}}>
                      <SelectTrigger id="age-filter" className="w-full z-[500]">
                        <SelectValue placeholder="Todas as idades" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="allAge">Todas as idades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="size-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Porte
                    </Label>
                    <Select value="" onValueChange={() => {}}>
                      <SelectTrigger id="size-filter" className="w-full z-[500]">
                        <SelectValue placeholder="Todos os tamanhos" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="allSize">
                          Todos os portes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="z-50">
                    <Label
                      htmlFor="gender-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Gênero
                    </Label>
                    <Select value="" onValueChange={() => {}}>
                      <SelectTrigger id="gender-filter" className="w-full z-[500]">
                        <SelectValue placeholder="Todos os gêneros" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="allGen">Todos os gêneros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}
          </section>

          {/* Cards */}
          <section className="mt-5">
            dasda
          </section>
        </main>
      </div>
    </div>
  );
};

export default Adote;
