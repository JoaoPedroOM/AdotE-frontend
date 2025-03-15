import { useEffect, useState } from "react";
import AnimalCard from "@/components/AnimalCard";
import Navbar from "@/components/global/Navbar";

import { organizacaoDetails } from "@/services/animalService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { Skeleton } from "../components/ui/skeleton";
import { Animal } from "@/models/animal";
import { Helmet } from "react-helmet";
import { formatCNPJ, formatPhoneNumber } from "@/utils/formatters";
import LocationMap from "@/components/LocationMap";

const OrganizacaoDetails = () => {
  const { id } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const [type, setType] = useState(searchParams.get("type") || "");
  const [age, setAge] = useState(searchParams.get("age") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");

  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (type) newSearchParams.set("type", type);
    if (age) newSearchParams.set("age", age);
    if (size) newSearchParams.set("size", size);
    if (gender) newSearchParams.set("gender", gender);
    if (currentPage) newSearchParams.set("page", currentPage.toString());

    setSearchParams(newSearchParams);
  }, [type, age, size, gender, currentPage, setSearchParams]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    setType("");
    setAge("");
    setSize("");
    setGender("");

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  const {
    data: organizacao = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizacao", Number(id), currentPage, type, age, size, gender],
    queryFn: () =>
      organizacaoDetails(
        Number(id),
        currentPage,
        type && type !== "allTypes" ? type.toUpperCase() : "",
        age && age !== "allAge" ? age.toUpperCase() : "",
        size && size !== "allSize" ? size.toUpperCase() : "",
        gender && gender !== "allGen" ? gender.toUpperCase() : ""
      ),
    staleTime: 20 * 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < organizacao.animais.totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  return (
    <div className="bg-radial-gradient h-full w-full">
      <Helmet>
        <title>AdotE | Perfil da Organização</title>
      </Helmet>
      <div className="content-layer">
        <Navbar />
        <main className="p-4 mx-auto max-w-[1300px]">
          {isLoading ? (
            <>
              <Skeleton className="md:w-1/2 w-full h-[45px] mx-auto mt-5" />
              <Skeleton className="w-full md:h-[212px] h-[400px] mt-5" />
            </>
          ) : (
            <>
              <div className="mx-auto w-full flex flex-col items-center justify-center mt-5">
                <h1 className="font-main font-bold leading-[1] text-[#D97706] text-5xl">
                  {organizacao.nome}
                </h1>
              </div>

              <div className="mt-10 bg-white shadow-lg rounded-lg lg:p-8 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Detalhes da Organização */}
                  <div className="font-tertiary">
                    <h2 className="font-main text-xl font-semibold text-[#30302E] mb-1">
                      Detalhes da Organização
                    </h2>
                    <p className="text-lg text-gray-600">
                      Nome:{" "}
                      <span className="font-bold text-gray-800 text-[17px]">
                        {organizacao.nome}
                      </span>
                    </p>
                    <p className="text-lg text-gray-600">
                      CNPJ:{" "}
                      <span className="font-bold text-gray-800 text-base">
                        {formatCNPJ(organizacao.cnpj)}
                      </span>
                    </p>
                  </div>

                  {/* Endereço */}
                  <div className="font-tertiary">
                    <h2 className="font-main text-xl font-semibold text-[#30302E] mb-1">
                      Endereço
                    </h2>
                    <p className="text-lg text-gray-600">
                      Rua:{" "}
                      <span className="font-bold text-gray-800 text-[17px]">
                        {organizacao.endereco?.rua},{" "}
                        {organizacao.endereco?.numero}
                      </span>
                    </p>
                    <p className="text-lg text-gray-600">
                      Cidade:{" "}
                      <span className="font-bold text-gray-800 text-[17px]">
                        {organizacao.endereco?.cidade},{" "}
                        {organizacao.endereco?.estado}
                      </span>
                    </p>
                    <LocationMap localizacao={organizacao.endereco} />
                  </div>

                  {/* Contato */}
                  <div className="font-tertiary">
                    <h2 className="font-main text-xl font-semibold text-[#30302E] mb-1">
                      Contato
                    </h2>
                    <p className="text-lg text-gray-600">
                      Email:{" "}
                      <span className="font-bold text-gray-800 text-[17px]">
                        {organizacao.email}
                      </span>
                    </p>
                    <p className="text-lg text-gray-600">
                      Número:{" "}
                      <span className="font-bold text-gray-800 text-base">
                        {formatPhoneNumber(organizacao.numero)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <section className="mt-10">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold font-tertiary">Filtros</div>

              <div className="flex gap-2">
                {type || age || size || gender ? (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 bg-red-200 hover:bg-red-300"
                  >
                    Limpar Filtros
                  </Button>
                ) : null}
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
                  {/* Filtro Tipo de Animal */}
                  <div>
                    <Label
                      htmlFor="type-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Tipo de Animal
                    </Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger
                        id="type-filter"
                        className="w-full z-[500]"
                      >
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="cachorro">Cachorro</SelectItem>
                        <SelectItem value="gato">Gato</SelectItem>
                        <SelectItem value="allTypes">Todos os tipos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro Idade */}
                  <div>
                    <Label
                      htmlFor="age-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Idade
                    </Label>
                    <Select value={age} onValueChange={setAge}>
                      <SelectTrigger id="age-filter" className="w-full z-[500]">
                        <SelectValue placeholder="Todas as idades" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="filhote">Filhote</SelectItem>
                        <SelectItem value="jovem">Jovem</SelectItem>
                        <SelectItem value="adulto">Adulto</SelectItem>
                        <SelectItem value="idoso">Idoso</SelectItem>
                        <SelectItem value="allAge">Todas as idades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro Porte */}
                  <div>
                    <Label
                      htmlFor="size-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Porte
                    </Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger
                        id="size-filter"
                        className="w-full z-[500]"
                      >
                        <SelectValue placeholder="Todos os tamanhos" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="pequeno">Pequeno</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                        <SelectItem value="allSize">Todos os portes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro Gênero */}
                  <div className="z-50">
                    <Label
                      htmlFor="gender-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Gênero
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger
                        id="gender-filter"
                        className="w-full z-[500]"
                      >
                        <SelectValue placeholder="Todos os gêneros" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="macho">Macho</SelectItem>
                        <SelectItem value="femea">Fêmea</SelectItem>
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
              <>
                {organizacao.animais.content.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 justify-items-center">
                    {organizacao.animais.content?.map((animal: Animal) => (
                      <AnimalCard key={animal.id} animal={animal} />
                    ))}
                  </div>
                ) : (
                  <p className="font-main text-2xl">Nenhum animal encontrado</p>
                )}
                {/* Paginação */}
                {organizacao.animais.totalPages > 1 && (
                  <Pagination className="my-5">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={`?page=${Math.max(currentPage - 1, 0)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(Math.max(currentPage - 1, 0));
                          }}
                          className={`bg-orange-400 hover:bg-orange-500 ${
                            currentPage === 0
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>

                      {[...Array(organizacao.animais.totalPages)].map(
                        (_, pageNumber) => (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href={`?page=${pageNumber}`}
                              isActive={currentPage === pageNumber}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              className="bg-orange-300 hover:bg-orange-400"
                            >
                              {pageNumber + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href={`?page=${Math.min(
                            currentPage + 1,
                            organizacao.animais.totalPages - 1
                          )}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(
                              Math.min(
                                currentPage + 1,
                                organizacao.animais.totalPages - 1
                              )
                            );
                          }}
                          className={`bg-orange-400 hover:bg-orange-500 ${
                            currentPage === organizacao.animais.totalPages - 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
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
                    Não conseguimos carregar os dados das organizações. Tente
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

export default OrganizacaoDetails;
