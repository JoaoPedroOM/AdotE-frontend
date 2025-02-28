import Navbar from "@/components/global/Navbar";

const Adote = () => {
  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Navbar/>
        <main className="p-4 mx-auto max-w-[1200px]">
          Escolha um animal para adotar
        </main>
      </div>
    </div>
  );
};

export default Adote;
