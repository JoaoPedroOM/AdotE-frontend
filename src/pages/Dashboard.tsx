import AnimalDetails from "@/components/AnimalDetails";
import Navbar from "@/components/global/Navbar";
import InforCards from "@/components/InfoCards";

const Dashboard = () => {
  return (
    <div className="bg-radial-gradient h-full w-full">
      <div className="content-layer">
        <Navbar />
        <main className="p-4 text-white mx-auto max-w-[1200px]">
        <div className="mb-5">
          <h1 className="font-main font-semibold text-black text-[22px]">
            Bem vindo, Aconchego Animal 👋
          </h1>
          <p className="text-gray-700 font-tertiary text-[14px]">
            Aqui está a análise completa dos seus animais!
          </p>
        </div>

        <InforCards/>
        <AnimalDetails />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
