import AnimaisCadastro from "@/components/AnimaisCadastro";
import AnimalDetails from "@/components/AnimalDetails";
import Navbar from "@/components/global/Navbar";
import InforCards from "@/components/InfoCards";
import { animaisCadastrados } from "@/services/animalService";
import { useAuthStore } from "@/stores/useAuthStore";
import { Skeleton } from "../components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";

const Dashboard = () => {
  const { organizacao } = useAuthStore();

  const {
    data: animais = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["animais", organizacao?.organizacao_id],
    queryFn: () => animaisCadastrados(organizacao?.organizacao_id),
    enabled: !!organizacao?.organizacao_id,
    staleTime: 20 * 60 * 1000,
  });

  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Navbar />
        <main className="p-4 text-white mx-auto max-w-[1200px]">
          <div className="mb-5 flex justify-between">
            <div>
              <h1 className="font-main font-semibold text-black sm:text-[22px] text-base">
                Bem vindo, <br className="sm:hidden block"/>{organizacao?.organizacao_name} 👋
              </h1>
              <p className="text-gray-700 font-tertiary text-[14px]">
                Aqui está a análise completa dos seus animais!
              </p>
            </div>
            {/* Cadastrar animais */}
            <AnimaisCadastro />
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Skeleton className="h-[110px] w-full rounded-lg shadow-sm" />
              <Skeleton className="h-[110px] w-full rounded-lg shadow-sm" />
            </div>
          ) : (
            <InforCards animais={animais.length} />
          )}

          <AnimalDetails animais={animais} carregando={isLoading} />

          {error && (
            <p className="text-red-500">
              {(error as Error).message || "Erro ao carregar animais."}
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
