const Button = ({ buttonPath, buttonTitle }: { buttonPath: string, buttonTitle: string }) => {
    return (
      <a
        href={buttonPath}
        className="font-second md:w-[40%] w-full text-center font-semibold lg:px-14 lg:py-5 py-3 px-10 lg:text-2xl text-[20px] bg-[#ffbe74] rounded-2xl mt-[20px] text-gray-900 transition-transform transition-border duration-300 ease-in-out hover:scale-95 hover:border-2 hover:border-[#D97706] hover:rounded-full"
      >
        {buttonTitle}
      </a>
    );
  };
  
  export default Button;
  