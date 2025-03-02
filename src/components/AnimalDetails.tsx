import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import { MessageSquare, PawPrint } from "lucide-react";
import type { animaisProp } from "../types/animaisProp";
import OrganizationAnimalCard from "./OrganizationAnimalCard";
import { usePaginationStore } from "@/stores/usePaginationStore";
import { useEffect } from "react";

const AnimalDetails = ({ animais, carregando }: animaisProp) => {
  const {setAnimalLength} = usePaginationStore()

  useEffect(() => {
    if (animais && !carregando) {
      setAnimalLength(animais.length);
    }
  }, [animais, carregando, setAnimalLength]);

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
        {carregando ? (
          <Skeleton className="h-[400px] w-[350px] rounded-lg shadow-sm" />
        ) : (
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 justify-items-center">
            {/* Map para criação de cards para todos animais */}
            {animais.length === 0 ? (
              <p className="text-gray-700 font-semibold text-xl w-full">
                Sem animais até o momento.
              </p>
            ) : (
              animais.map((animal) => (
                <OrganizationAnimalCard animal={animal} key={animal.id} />
              ))
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AnimalDetails;
