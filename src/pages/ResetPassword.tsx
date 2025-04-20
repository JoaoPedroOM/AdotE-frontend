import {
  emailSchema,
  codigoStepSchema,
  newPasswordSchema,
  EmailFormValues,
  OtpStepFormValues,
  NewPasswordFormValues,
} from "../schemas/authSchema";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useMemo, useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import logo from "../assets/img/logo2.png";

const ResetPassword = () => {
  const navigate = useNavigate()
  const { resetPassword, sendCodigo, verifyCodigo } = useAuth();
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "codigo" | "newPassword">("email");

  const currentResolver = useMemo(() => {
    if (step === "codigo") {
      return zodResolver(codigoStepSchema);
    }
    if (step === "newPassword") {
      return zodResolver(newPasswordSchema);
    }
    return zodResolver(emailSchema);
  }, [step]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<any>({
    resolver: currentResolver,
    defaultValues: {
      email: "",
      codigo: "",
      password: "",
    },
  });

  const handleSendCodigo = async (data: EmailFormValues) => {
    try {
      await sendCodigo(data.email);
      setEmail(data.email);
      setErrorMessage(null)
      setStep("codigo");
    } catch (error) {
      setErrorMessage(error +" 🚧");
      console.error("Erro ao enviar o código:", error);
    }
  };

  const handleVerifyCodigo = async (data: OtpStepFormValues) => {
    try {
      await verifyCodigo(data.email, data.codigo);
      setToken(data.codigo);
      setErrorMessage(null)
      setStep("newPassword");
    } catch (error) {
      console.error("Erro ao verificar o código:", error);
      setErrorMessage(error +" 🚧");
    }
  };

  const handleSubmitNewPassword = async (data: NewPasswordFormValues) => {
    try {
      await resetPassword(data.email,token, data.password);
      reset({
        email: "",
        codigo: "",
        password: "",
      });
      setSuccessMessage("Sua senha foi alterada com sucesso!");
      setPasswordUpdated(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Erro ao tentar resetar senha:", error);
      setErrorMessage(error +" 🚧");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="fundo_inicio" />
      <div className="bg-particles" />
      <div className="fundo_vinheta escuro" />
      <div className="page_texture" />

      <div className="w-1/2 h-screen py-5 pl-5 lg:block hidden">
        <img
          src="https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>

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
        <div className="text-center mb-8 text-black flex flex-col items-center">
          <h1 className="font-main text-3xl">Trocar a Senha</h1>
          <p className="font-tertiary text-center">
            {step === "email" && "Digite seu e-mail para recuperar sua senha."}
            {step === "codigo" &&
              "Enviamos um código para seu e-mail. Insira-o abaixo."}
            {step === "newPassword" && "Está pronto para criar uma nova senha?"}
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-sm font-semibold w-full max-w-sm">
            {errorMessage}
          </div>
        )}

        <form
          className="grid w-full max-w-sm items-center gap-5 lg:px-0 px-5"
          onSubmit={handleSubmit(
            step === "email"
              ? handleSendCodigo
              : step === "codigo"
              ? handleVerifyCodigo
              : handleSubmitNewPassword
          )}
        >
          {step === "email" && (
            <>
              <div>
                <Label htmlFor="email" className="text-black font-tertiary">
                  Email da sua conta
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
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-orange-500 py-6 text-base hover:bg-orange-700"
                )}
                disabled={isSubmitting}
              >
                Enviar código de recuperação
              </button>
            </>
          )}

          {step === "codigo" && (
            <>
              <div className="flex flex-col items-center">
                <Label
                  htmlFor="codigo"
                  className="text-black font-tertiary flex flex-col mb-3"
                >
                  <span className="font-normal">
                    Código de Verificação enviado para:
                  </span>
                  <span className="text-center">{email}</span>
                </Label>
                <div className="flex items-center justify-center mt-2">
                  <Controller
                    control={control}
                    name="codigo"
                    render={({ field }) => (
                      <InputOTP
                        {...field}
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </div>
                <p className="text-xs font-semibold text-red-700 mt-1">
                  <ErrorMessage errors={errors} name="codigo" />
                </p>
              </div>
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-orange-400 py-6 text-base hover:bg-orange-500"
                )}
                disabled={isSubmitting}
              >
                Confirmar código
              </button>
            </>
          )}

          {step === "newPassword" && (
            <>
              <div>
                <Label htmlFor="password" className="text-black font-tertiary">
                  Nova Senha
                </Label>
                <input
                  type="password"
                  id="password"
                  placeholder="Nova senha"
                  className="input"
                  {...register("password")}
                />
                <p className="text-xs font-semibold text-red-700 mt-1">
                  <ErrorMessage errors={errors} name="password" />
                </p>
              </div>
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-orange-400 py-6 text-base hover:bg-orange-500"
                )}
                disabled={isSubmitting || passwordUpdated}
              >
                Atualizar Senha
              </button>
            </>
          )}

          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-gray-900 py-6 text-base"
            )}
            to="/login"
          >
            Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
