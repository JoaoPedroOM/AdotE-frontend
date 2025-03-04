import { useState } from "react";
import Navbar from "@/components/global/Navbar";
import AnimalCard from "@/components/AnimalCard";

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
import { Skeleton } from "../components/ui/skeleton";
import { Filter, MapPin } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { animaisDisponiveis } from "@/services/animalService";
import type { Animal } from "../models/animal";

const Adote = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const {
    data: animais = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allAnimals"],
    queryFn: () => animaisDisponiveis(),
    staleTime: 20 * 60 * 1000,
  });

  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Navbar />
        <main className="p-4 mx-auto max-w-[1300px]">
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <Label
                      htmlFor="location-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Localização
                    </Label>
                    <Select value="" onValueChange={() => {}}>
                      <SelectTrigger
                        id="location-filter"
                        className="w-full z-[500]"
                      >
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
                      <SelectTrigger
                        id="type-filter"
                        className="w-ful z-[500]l"
                      >
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
                      <SelectTrigger
                        id="size-filter"
                        className="w-full z-[500]"
                      >
                        <SelectValue placeholder="Todos os tamanhos" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="allSize">Todos os portes</SelectItem>
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
                      <SelectTrigger
                        id="gender-filter"
                        className="w-full z-[500]"
                      >
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
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[400px] w-full rounded-lg shadow-sm" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {animais.animals?.map((animal: Animal) => (
                  <AnimalCard key={animal.id} animal={animal} />
                ))}
              </div>
            )}
          </section>
          {error && (
            <div className="flex items-center justify-center bg-red-50 border border-red-300 p-4 rounded-lg mt-6">
              <div className="flex items-center gap-4">
                {/* Ícone de erro */}
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
                    Não conseguimos carregar os dados dos animais. Tente
                    novamente mais tarde.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Adote;
