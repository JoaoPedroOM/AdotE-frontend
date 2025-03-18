import { Button } from "@/components/ui/button";
import { generateQrCode } from "@/services/animalService";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PixQrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixTipo: string;
  chavePix: string;
  organizationName: string;
  city: string;
}

const PixQrCodeModal = ({
  isOpen,
  onClose,
  pixTipo,
  chavePix,
  organizationName,
  city,
}: PixQrCodeModalProps) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tipo = pixTipo.toUpperCase();
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setQrCodeData(null);

      generateQrCode(tipo, chavePix, organizationName, city)
        .then((data) => {
          if (data.qrcode_base64) {
            setQrCodeData(data.qrcode_base64);
          } else if (data.qrCodeUrl) {
            setQrCodeData(data.qrCodeUrl);
          } else {
            throw new Error("QR Code data not found in response");
          }
        })
        .catch((err) => {
          setError("Erro ao gerar o QR Code");
          toast.error("Erro ao gerar o QR Code. Tente novamente.");
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, pixTipo, chavePix, organizationName, city]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-main text-xl font-semibold text-[#30302E]">QR Code PIX</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <p className="text-center text-gray-600 mb-4 font-tertiary">
            Escaneie este código com o aplicativo do seu banco para fazer uma doação
          </p>

          {isLoading ? (
            <p className="text-gray-600">Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : qrCodeData ? (
            <div className="border rounded-lg p-3 bg-white shadow-sm">
              <img
                src={qrCodeData}
                alt="QR Code PIX"
                className="w-[250px] h-[250px]"
              />
            </div>
          ) : (
            <p className="text-gray-600">Aguardando geração do QR Code...</p>
          )}

          <div className="flex flex-col w-full mt-4 gap-2">
            <Button onClick={onClose} variant="outline" className="mt-2">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixQrCodeModal;