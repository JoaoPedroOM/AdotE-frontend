import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";
import { cn } from "@/lib/utils";

const orangeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

function MapLoader({ onLoad }: { onLoad: () => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.whenReady(() => {
        onLoad();
      });
    }
  }, [map, onLoad]);

  return null;
}

const LocationMap = ({ localizacao }: any) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const getCoordinates = async () => {
    setIsLoading(true);
    try {
      const address = `${localizacao.rua}, ${localizacao.numero}, ${localizacao.cidade}, ${localizacao.estado}, ${localizacao.cep}, Brasil`;
      const encodedAddress = encodeURIComponent(address);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
        {
          headers: {
            "Accept-Language": "pt-BR",
            "User-Agent": "AdotE"
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao buscar coordenadas');
      
      const data = await response.json();
      
      if (data?.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoordinates([lat, lon]);
        setIsModalOpen(true);
        setIsMapLoading(true);
      } else {
        toast.error("Endereço não encontrado.");
      }
    } catch (error) {
      toast.error("Erro ao buscar coordenadas.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

  return (
    <div className="pt-0">
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setIsMapLoading(false);
        }
      }}>
        <DialogTrigger asChild>
          <Button 
            onClick={getCoordinates}
            variant="link"
            disabled={isLoading}
            className={cn("p-0 mx-0")}
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Carregando...
              </>
            ) : (
              <>
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">Ver Localização</span>
              </>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-[100vw] w-[100vw] h-[90vw] sm:max-w-[70vh] sm:h-[70vh] z-[999] pt-12 rounded-lg shadow-lg">
          {coordinates && (
            <div className="relative h-full">
              {isMapLoading && (
                <div className="absolute inset-0 z-[999] flex flex-col items-center justify-center bg-gray-100 bg-opacity-80">
                  <div className="h-10 w-10 mb-4 animate-spin rounded-full border-4 border-gray-300 border-t-orange-600"></div>
                  <p className="text-lg font-medium text-gray-700 font-main">Carregando mapa...</p>
                </div>
              )}
              <MapContainer 
                center={coordinates} 
                zoom={15} 
                style={{ height: "100%", width: "100%" }}
                zoomControl={true}
              >
                <MapLoader onLoad={handleMapLoad} />
                <ChangeView center={coordinates} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coordinates} icon={orangeIcon}>
                  <Popup className="text-sm font-medium">
                    {localizacao.rua}, {localizacao.numero}<br />
                    {localizacao.cidade}, {localizacao.estado}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationMap;