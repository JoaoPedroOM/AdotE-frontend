import { Link } from "react-router-dom";
import notfound from "../assets/img/notfound.png";
import { useAuthStore } from "@/stores/useAuthStore";

const NotFound = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center md:px-0 px-2">
        <h1 className="md:text-5xl text-2xl font-bold font-main text-gray-800 text-center">
          Nada encontrado aqui...
        </h1>
        <img
          src={notfound}
          alt="desenho de um cachorro com uma página em sua boca"
          className="w-[300px] my-6"
        />
        <h3 className="font-tertiary md:text-3xl text-xl text-gray-700 text-center">
          Não foi possível encontrar a página solicitada
        </h3>
        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className="font-second text-center font-semibold lg:px-10 lg:py-5 py-3 px-10 lg:text-2xl text-[20px] bg-[#ffbe74] rounded-2xl mt-[20px] text-[#D97706] 
      transition-all duration-200 hover:scale-95 hover:bg-[#D97706] hover:text-white"
          >
            Voltar ao dashboard
          </Link>
        ) : (
          <Link
            to="/"
            className="font-second text-center font-semibold lg:px-10 lg:py-5 py-3 px-10 lg:text-2xl text-[20px] bg-[#ffbe74] rounded-2xl mt-[20px] text-[#D97706] 
    transition-all duration-200 hover:scale-95 hover:bg-[#D97706] hover:text-white"
          >
            Voltar a Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
