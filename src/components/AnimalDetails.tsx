import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, PawPrint } from "lucide-react";
import type { animaisProp } from "../types/animaisProp";
import OrganizationAnimalCard from "./OrganizationAnimalCard";

const AnimalDetails = ({animais} : animaisProp) => {

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
            <OrganizationAnimalCard animal={animal} key={index} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnimalDetails;
