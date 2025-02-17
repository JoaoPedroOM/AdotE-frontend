const Hero = () => {
    return (
      <div className="md:mt-[10%] mt-[25%] flex items-center justify-center text-center flex-col">
        <h3 className="font-second text-center text-[#F59E0B] subtitle">
          Amor de verdade tem patas!
        </h3>
        <h1 className="font-main font-bold leading-[1] text-[#D97706] title">
          Resgate, Cuide e <br className="md:block hidden" />
          Ganhe um Amigo!
        </h1>
        <button
          className="font-second text-center font-semibold lg:px-14 lg:py-5 py-3 px-10 lg:text-2xl text-[20px] bg-[#ffbe74] rounded-2xl mt-[20px] text-[#D97706] 
    transition-all duration-200 hover:scale-95 hover:bg-[#D97706] hover:text-white"
        >
          Adotar
        </button>
      </div>
    );
  };
  
  export default Hero;
  