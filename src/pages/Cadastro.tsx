import { InputMask } from "@react-input/mask";
import type { RegisterFormValues } from "@/schemas/authSchema";
import { registerSchema } from "../schemas/authSchema";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Link } from "react-router";

import chorome from "../assets/img/chrome.png";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Cadastro = () => {
  const { cadastroAndLogin, error } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: FieldValues) {
    console.log("Form dados:", data);
    const email = data.email;
    const password = data.password;
    const role = "ORGANIZATION";
    const name = data.organizationName;
    const cnpj = data.cnpj.replace(/\D/g, "");
    const postalCode = data.cep.replace(/\D/g, "");
    const phoneNumber = data.phone.replace(/\D/g, "");

    try {
      await cadastroAndLogin(
        email,
        password,
        role,
        name,
        cnpj,
        postalCode,
        phoneNumber
      );

      reset({
        email: "",
        password: "",
        cnpj: "",
        organizationName: "",
        phone: "",
        cep: "",
      });
    } catch (error) {
      console.error("Erro ao tentar cadastrar:", error);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="fundo_inicio" />
      <div className="bg-particles" />
      <div className="fundo_vinheta escuro" />
      <div className="page_texture" />

      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={chorome} className="h-8" alt="Adota Logo" />
          <span className="self-center text-2xl font-bold font-main whitespace-nowrap text-black">
            Adotar
          </span>
        </Link>
        <div className="text-center mb-[30px] text-black">
          <h1 className="font-main text-3xl">
            Cadastre-se agora
            <br />
          </h1>
          <p className="font-tertiary">
            Já possui uma conta?{" "}
            <Link className="text-orange-600 font-bold" to="/login">
              Entrar
            </Link>
          </p>
        </div>

        <form
          className="grid w-full max-w-sm items-center gap-2 lg:px-0 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label
              htmlFor="organizationName"
              className="text-black font-tertiary"
            >
              Nome da organização
            </Label>
            <input
              type="text"
              id="organizationName"
              placeholder="Nome da organização"
              className="input"
              {...register("organizationName")}
            />
            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="organizationName" />
            </p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-black font-tertiary">
              Telefone
            </Label>
            <InputMask
              mask="(__) _____-____"
              replacement={{ _: /\d/ }}
              {...register("phone")}
              placeholder="(00) 00000-0000"
              className="input"
            />
            <p className="text-xs font-semibold text-red-700 mt-1">
              <ErrorMessage errors={errors} name="phone" />
            </p>
          </div>

          <div>
            <Label htmlFor="cnpj" className="text-black font-tertiary">
              CNPJ
            </Label>
            <InputMask
              mask="__.___.___/____-__"
              replacement={{ _: /\d/ }}
              {...register("cnpj")}
              placeholder="00.000.000/0000-00"
              className="input"
            />
            <p className="text-xs text-red-700 mt-1">
              <ErrorMessage errors={errors} name="cnpj" />
            </p>
          </div>

          <div>
            <Label htmlFor="cep" className="text-black font-tertiary">
              CEP
            </Label>
            <InputMask
              mask="_____-___"
              replacement={{ _: /\d/ }}
              {...register("cep")}
              placeholder="00000-000"
              className="input"
            />
            <p className="text-xs text-red-700 mt-1">
              <ErrorMessage errors={errors} name="cep" />
            </p>
          </div>

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
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
              {error}
            </div>
          )}

          <button
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-orange-400 py-[25px] text-base hover:bg-[#bd6d2c] mt-2"
            )}
            type="submit"
            disabled={isSubmitting}
          >
            Cadastrar
          </button>
        </form>
      </div>

      <div className="w-1/2 h-screen py-5 pr-5 lg:block hidden">
        <img
          src="https://images.unsplash.com/photo-1599194921977-f89d8bd0eefb?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  );
};

export default Cadastro;
