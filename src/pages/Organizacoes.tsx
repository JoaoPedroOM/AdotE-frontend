import { useEffect, useState } from "react";
import Navbar from "@/components/global/Navbar";

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { Skeleton } from "../components/ui/skeleton";
import { Filter } from "lucide-react";

import { organizacoesDisponiveis } from "@/services/animalService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Organizacao } from "@/models/organizacao";
import OrganizationCard from "@/components/OrganizationCard";

const fetchStates = async () => {
  const response = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
  );
  if (!response.ok) {
    throw new Error("Falha ao carregar estados");
  }
  return response.json();
};

const fetchCities = async (stateUF: any) => {
  if (!stateUF) return [];
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateUF}/municipios?orderBy=nome`
  );
  if (!response.ok) {
    throw new Error("Falha ao carregar cidades");
  }
  return response.json();
};

const Organizacoes = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const [estado, setEstado] = useState(searchParams.get("estado") || "");
  const [cidade, setCidade] = useState(searchParams.get("cidade") || "");


  const { data: states, isLoading: isStatesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  // Usando o Tanstack Query para obter as cidades do estado selecionado
  const { data: cities, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities", estado],
    queryFn: () => fetchCities(estado),
    enabled: !!estado, 
  });

  const handleStateChange = (newState: any) => {
    setEstado(newState);
    setCidade(""); 

    // Atualiza os parâmetros da URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("estado", newState);
    newSearchParams.delete("cidade");
    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  const handleCityChange = (newCity: any) => {
    setCidade(newCity);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("cidade", newCity);
    newSearchParams.set("page", "0"); 
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (currentPage) newSearchParams.set("page", currentPage.toString());
    if (estado) newSearchParams.set("estado", estado);
    if (cidade) newSearchParams.set("cidade", cidade);

    setSearchParams(newSearchParams);
  }, [currentPage, estado, cidade, setSearchParams]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    setEstado("");
    setCidade("");

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  // Modifique a query para incluir os filtros de estado e cidade
  const {
    data: organizations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allOrganizacoes", currentPage, estado, cidade],
    queryFn: () =>
      organizacoesDisponiveis(
        currentPage,
        estado && estado !== "allEstado" ? estado.toUpperCase() : "",
        cidade && cidade !== "allCidade" ? cidade : ""
      ),
    staleTime: 20 * 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < organizations.totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", newPage.toString());
      setSearchParams(newSearchParams);
    }
  };

  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Helmet>
          <title>AdotE</title>
        </Helmet>
        <Navbar />
        <main className="p-4 mx-auto max-w-[1300px]">
          <div className="mx-auto w-full flex flex-col items-center justify-center mt-5">
            <h1 className="font-main font-bold leading-[1] text-[#D97706] text-5xl">
              Organizações Parceiras
            </h1>
            <p className="font-tertiary">
              Conheça as organizações que estão colaborando conosco para
              garantir um futuro melhor para os animais.
            </p>
          </div>

          <section className="mt-10">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold font-tertiary">Filtros</div>

              <div className="flex gap-2">
                {(estado || cidade) && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 bg-red-200 hover:bg-red-300"
                  >
                    Limpar Filtros
                  </Button>
                )}
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
                  {/* Filtro Estado */}
                  <div>
                    <Label
                      htmlFor="state-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Estado
                    </Label>
                    <Select value={estado} onValueChange={handleStateChange}>
                      <SelectTrigger
                        id="state-filter"
                        className="w-full z-[500]"
                      >
                        <SelectValue placeholder="Selecione um estado" />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        <SelectItem value="allEstado">
                          Todos os estados
                        </SelectItem>
                        {isStatesLoading ? (
                          <SelectItem value="loading">Carregando...</SelectItem>
                        ) : (
                          states?.map((estado: any) => (
                            <SelectItem key={estado.id} value={estado.sigla}>
                              {estado.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro Cidade */}
                  <div>
                    <Label
                      htmlFor="city-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Cidade
                    </Label>
                    <Select
                      value={cidade}
                      onValueChange={handleCityChange}
                      disabled={!estado || isCitiesLoading}
                    >
                      <SelectTrigger
                        id="city-filter"
                        className="w-full z-[500]"
                      >
                        <SelectValue
                          placeholder={
                            estado
                              ? "Selecione uma cidade"
                              : "Selecione um estado primeiro"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="z-[500]">
                        {estado && (
                          <SelectItem value="allCidade">
                            Todas as cidades
                          </SelectItem>
                        )}
                        {isCitiesLoading ? (
                          <SelectItem value="loading">Carregando...</SelectItem>
                        ) : (
                          cities?.map((cidade: any) => (
                            <SelectItem key={cidade.id} value={cidade.nome}>
                              {cidade.nome}
                            </SelectItem>
                          ))
                        )}
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
              <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
                <Skeleton className="h-[90px] w-full rounded-lg shadow-sm" />
              </div>
            ) : (
              <>
                {organizations.organizacoes?.length > 0 ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
                    {organizations.organizacoes?.map(
                      (organizacao: Organizacao) => (
                        <OrganizationCard
                          key={organizacao.id}
                          organizacao={organizacao}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <p className="font-main text-2xl">
                    Nenhuma organização encontrada
                  </p>
                )}
                {/* Paginação */}
                {organizations.totalPages > 1 && (
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

                      {[...Array(organizations.totalPages)].map(
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
                            organizations.totalPages - 1
                          )}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(
                              Math.min(
                                currentPage + 1,
                                organizations.totalPages - 1
                              )
                            );
                          }}
                          className={`bg-orange-400 hover:bg-orange-500 ${
                            currentPage === organizations.totalPages - 1
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

export default Organizacoes;
