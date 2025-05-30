import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Cadastro from "@/pages/Cadastro";
import ResetPassword from "@/pages/ResetPassword";
import Footer from "@/components/global/Footer";
import Dashboard from "@/pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import NotFound from "@/pages/NotFound";
import Adote from "@/pages/Adote";
import AnimalProfile from "@/pages/AnimalProfile";
import Organizacoes from "@/pages/Organizacoes";
import OrganizacaoDetails from "@/pages/OrganizacaoDetails";

export function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública (qualquer um pode acessar) */}
      <Route
        path="/"
        element={
          <>
            <App />
            <Footer />
          </>
        }
      />

      <Route
        path="/adote/perfil/:id"
        element={
          <>
            <AnimalProfile />
            <Footer />
          </>
        }
      />

      <Route
        path="/adote"
        element={
          <>
            <Adote />
            <Footer />
          </>
        }
      />

      <Route
        path="/organizacoes"
        element={
          <>
            <Organizacoes />
            <Footer />
          </>
        }
      />

      <Route
        path="/organizacoes/detalhes/:id"
        element={
          <>
            <OrganizacaoDetails />
            <Footer />
          </>
        }
      />

      {/* Rota pública para não logados (quem tá logado não pode acessar) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Route>

      {/* Rota privada (somente quem está logado pode acessar) */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
