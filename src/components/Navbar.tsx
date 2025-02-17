import { useState } from "react";
import chorome from "../assets/img/chrome.png";
import { Link } from "react-router";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="font-main relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 md:py-6 pt-4">
        <Link
          to="#"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={chorome} className="h-8" alt="Adota Logo" />
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
          <ul className="font-normal text-[20px] uppercase flex flex-col p-4 md:p-0 mt-4 border md:border-none border-[#FDBA74]  rounded-lg md:bg-transparent bg-[#FED7AA] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
              >
                Adotar
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link
                to="/"
                className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
              >
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="block py-2 px-3 md:text-[#30302E] text-black rounded-sm hover:bg-[#FFEDD5] md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0"
              >
                Sou ONG
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
