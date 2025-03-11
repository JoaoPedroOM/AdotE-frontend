import { Organizacao } from "@/models/organizacao";
import { ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const OrganizationCard = ({ organizacao }: { organizacao: Organizacao }) => {

  return (
    <Link
      key={organizacao.id}
      to={`/organizacoes/detalhes/${organizacao.id}`}
      className="bg-gradient-to-r from-orange-200 to-orange-100 border rounded-lg p-4 hover:shadow-md transition-all duration-300 fade-in cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex-grow space-y-1">
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors font-main tracking-[0.3px]">
              {organizacao.nome}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm font-tertiary">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {organizacao.endereco.cidade}, {organizacao.endereco.estado}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
};

export default OrganizationCard;
