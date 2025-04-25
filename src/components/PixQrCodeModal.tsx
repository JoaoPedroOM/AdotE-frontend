import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [isOpen, chavePix]);

  if (!isOpen) return null;

  const formatPixKey = (tipo: string, chave: string) => {
    if (tipo.toUpperCase() === "TELEFONE") {
      if (chave.startsWith("+")) {
        return chave;
      }
      const numbersOnly = chave.replace(/\D/g, "");
      
      if (numbersOnly.startsWith("55") && numbersOnly.length >= 12) {
        return `+${numbersOnly}`;
      }      
      return `+55${numbersOnly}`;
    }
    return chave;
  };

  const formattedChavePix = formatPixKey(pixTipo, chavePix);
  
  const qrCodeUrl = `https://gerarqrcodepix.com.br/api/v1?nome=${encodeURIComponent(organizationName)}&cidade=${encodeURIComponent(city)}&chave=${encodeURIComponent(formattedChavePix)}&saida=qr`;

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
    toast.error("Erro ao gerar o QR Code. Verifique se a chave PIX informada é válida.");
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    toast.success("QR Code gerado com sucesso!");
  };

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
          {!imageLoaded && !imageError && (
            <div className="flex flex-col items-center justify-center h-[250px] w-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-sm text-gray-600">Gerando QR Code...</p>
            </div>
          )}
          
          {!imageError && (
            <div className={`border rounded-lg p-3 bg-white shadow-sm ${!imageLoaded ? 'hidden' : ''}`}>
              <img
                src={qrCodeUrl}
                alt="QR Code PIX"
                className="w-[250px] h-[250px]"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}
          
          {imageError && (
            <div className="flex flex-col items-center justify-center h-[250px] w-full">
              <p className="text-red-500 font-medium">Erro ao gerar QR Code</p>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Verifique se a chave PIX informada é válida.
                <br />
                Exemplos de formatos válidos:
              </p>
              <ul className="mt-2 text-xs text-gray-600 list-disc pl-5">
                <li>CPF/CNPJ: 01234567890</li>
                <li>Telefone: +5531912345678</li>
                <li>E-mail: exemplo@email.com</li>
                <li>Chave aleatória: 2aa96c40-d85f-4b98-b29f-d158a1c45f7f</li>
              </ul>
            </div>
          )}

          {imageLoaded && !imageError && (
            <p className="text-center text-gray-600 mt-4 font-tertiary">
              Escaneie este código com o aplicativo do seu banco para fazer uma doação
            </p>
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