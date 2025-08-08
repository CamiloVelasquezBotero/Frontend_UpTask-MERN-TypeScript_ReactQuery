import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import type { UpdateCurrentUserPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileAPI";
import { toast } from "react-toastify";

export default function ChangePasswordView() {
  const initialValues:UpdateCurrentUserPasswordForm = {
    currentPassword: '',
    password: '',
    passwordConfirmation: ''
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: initialValues })

  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: error => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data)
    }
  })

  // Con el (watch) revisamos que los password sean iguales, nos da acceso a (validate) en passwordConfirmation
  const password = watch('password');

  const handleChangePassword = (formData:UpdateCurrentUserPasswordForm) => mutate(formData) // Mutamos

  return (
    <>
      <div className="mx-auto max-w-3xl">

        <h1 className="text-5xl font-black ">Cambiar Password</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Utiliza este formulario para cambiar tu password</p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-10 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="currentPassword"
            >Password Actual</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Password Actual"
              className="w-full p-3  border border-gray-200"
              {...register("currentPassword", {
                required: "El password actual es obligatorio",
              })}
            />
            {errors.currentPassword && (
              <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="password"
            >Nuevo Password</label>
            <input
              id="password"
              type="password"
              placeholder="Nuevo Password"
              className="w-full p-3  border border-gray-200"
              {...register("password", {
                required: "El Nuevo Password es obligatorio",
                minLength: {
                  value: 8,
                  message: 'El Password debe ser mínimo de 8 caracteres'
                }
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="passwordConfirmation"
              className="text-sm uppercase font-bold"
            >Repetir Password</label>

            <input
              id="passwordConfirmation"
              type="password"
              placeholder="Repetir Password"
              className="w-full p-3  border border-gray-200"
              {...register("passwordConfirmation", {
                required: "Este campo es obligatorio",
                validate: value => value === password || 'Los Passwords no son iguales'
              })}
            />
            {errors.passwordConfirmation && (
              <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value='Cambiar Password'
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  )
}
