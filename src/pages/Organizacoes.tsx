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
import { Filter, MapPin } from "lucide-react";

import { organizacoesDisponiveis } from "@/services/animalService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Organizacao } from "@/models/organizacao";
import OrganizationCard from "@/components/OrganizationCard";

const Organizacoes = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "0", 10);

  const [location, setLocation] = useState(searchParams.get("location") || "");
  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (location) newSearchParams.set("location", location);
    if (currentPage) newSearchParams.set("page", currentPage.toString());

    setSearchParams(newSearchParams);
  }, [location, currentPage, setSearchParams]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    setLocation("");

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  const {
    data: organizations = [],
    isLoading,
    error,
  } = useQuery({
    // queryKey: ["allOrganizacoes", currentPage, location] "quando tiver enviando a localização",
    queryKey: ["allOrganizacoes", currentPage, location],
    queryFn: () =>
      organizacoesDisponiveis(
        currentPage
        // location && Location !== "allLocations" ? location.toUpperCase() : ""
      ),
    staleTime: 20 * 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < organizations.totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  console.log(organizations);

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
                {location && (
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
                  {/* Filtro Localização */}
                  <div>
                    <Label
                      htmlFor="location-filter"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Localização
                    </Label>
                    <Select value={location} onValueChange={setLocation}>
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
                        <SelectItem value="allLocations">
                          Todas as localizações
                        </SelectItem>
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
                {organizations.organizacoes.length > 0 ? (
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

export default Organizacoes;
