import { useState } from "react";
import logo from "../../assets/img/chrome.png";
import { Link, useNavigate } from "react-router";

// import { Link as ScrollLink } from "react-scroll";
import { HashLink } from 'react-router-hash-link';

import perfil from "../../assets/img/UserPerfil.png"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {isLoggedIn, islogout} = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = () => {
    islogout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="font-main relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 md:py-6 pt-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-8" alt="Adota Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#30302E]">
            Adotar
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`absolute md:static px-2 top-full left-0 right-0 w-full md:block md:w-auto z-50 ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-default"
        >
          <ul className="font-normal items-center text-[20px] uppercase flex flex-col p-4 md:p-0 mt-4 border md:border-none border-[#FDBA74]  rounded-lg md:bg-transparent bg-[#FED7AA] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
            <li className="md:w-auto w-full">
              <Link
                to="/adote"
                className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
              >
                Adotar
              </Link>
            </li>
            <li className="cursor-pointer md:w-auto w-full">
            <HashLink
          smooth
          to="/#sobre"
          className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
        >
          Sobre Nós
        </HashLink>
            </li>
            {isLoggedIn ? (
              <div className="md:w-auto w-full md:px-3">
                <div className="md:block hidden">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={perfil}
                      alt="@user"
                    />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 z-[2000]">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/reset")} className="cursor-pointer">
                    Resetar senha
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}  className="cursor-pointer">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                </div>
                <div className="md:hidden block">
                <li className="md:w-auto w-full">
                <Link
                  to="/dashboard"
                  className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
                >
                  Dashboard
                </Link>
              </li>
              <li className="md:w-auto w-full">
                <Link
                  to="/reset"
                  className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
                >
                  Resetar senha
                </Link>
              </li>
              <li className="md:w-auto w-full">
              <button
                  onClick={handleLogout}
                  className="block py-2 px-3 uppercase md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
                >
                  Sair
                </button>
              </li>
                </div>
              </div>
            ) : (
              <li className="md:w-auto w-full">
                <Link
                  to="login"
                  className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
                >
                  Sou ONG
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
