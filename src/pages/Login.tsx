import type { LoginFormValues } from "../schemas/authSchema";
import { loginSchema } from "../schemas/authSchema";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet";

import logo from "../assets/img/logo2.png";
import authBanner from "../assets/img/authBanner.avif"
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: FieldValues) {
    try {
      await login(data.email, data.password);
      reset({
        email: "",
        password: "",
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="page_texture" />
      <div className="fundo_inicio" />
      <div className="fundo_vinheta" />

      <Helmet>
        <title>AdotE | Login</title>
        <meta
          name="description"
          content="Faça login como organização na plataforma AdotE para gerenciar seus animais disponíveis para adoção, editar informações e conectar-se com adotantes."
        />
        {/* Facebook Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AdotE | Login" />
        <meta
          property="og:description"
          content="Faça login como organização na plataforma AdotE para gerenciar seus animais disponíveis para adoção, editar informações e conectar-se com adotantes."
        />
        <meta
          property="og:image"
          content={logo}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://adot-e.vercel.app/login" />
        <meta property="og:site_name" content="AdotE" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AdotE | Login" />
        <meta
          name="twitter:description"
          content="Faça login como organização na plataforma AdotE para gerenciar seus animais disponíveis para adoção, editar informações e conectar-se com adotantes."
        />
        <meta
          name="twitter:image"
          content={logo}
        />
        {/* WhatsApp Preview Tags */}
        <meta
          property="og:image:secure_url"
          content={logo}
        />
        <meta property="og:locale" content="pt_BR" />
      </Helmet>

      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-10" alt="Adota Logo" />
          <span className="self-center text-2xl font-bold font-main whitespace-nowrap text-black">
            AdotE
          </span>
        </Link>
        <div className="text-center mb-[30px] text-black">
          <h1 className="font-main text-3xl">
            Olá, Boas-vindas!
            <br />
          </h1>
          <p className="font-tertiary">
            Ainda não tem uma conta?{" "}
            <Link className="text-orange-600 font-bold" to="/cadastro">
              Cadastrar
            </Link>
          </p>
        </div>
        <form
          className="grid w-full max-w-sm items-center gap-5 lg:px-0 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label htmlFor="email" className="text-black font-tertiary">
              Email
            </Label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="input"
              {...register("email")}
            />
            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="email" />
            </p>
          </div>
          <div>
            <Label htmlFor="password" className="text-black font-tertiary">
              Senha
            </Label>
            <input
              type="password"
              id="password"
              placeholder="Senha"
              className="input"
              {...register("password")}
            />
            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="password" />
            </p>
            {/* <div className="mt-2 text-right">
              <Link
                className="text-orange-600 font-tertiary font-normal"
                to="/reset"
              >
                Esqueceu sua senha?
              </Link>
            </div> */}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
              {error}
            </div>
          )}
          <button
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-orange-400 py-[25px] text-base hover:bg-[#bd6d2c]"
            )}
            disabled={isSubmitting}
          >
            Entrar
          </button>
        </form>
      </div>

      <div className="w-1/2 h-screen py-5 pr-5 lg:block hidden">
        <img
          src={authBanner}
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
