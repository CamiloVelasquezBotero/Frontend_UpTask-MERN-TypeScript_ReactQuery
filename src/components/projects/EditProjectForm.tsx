import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { ProjectFormData } from "@/types/index";
import ProjectForm from "./ProjectForm";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormPrps = {
   data: ProjectFormData,
   projectId: string
}

export default function EditProjectForm({ data, projectId }: EditProjectFormPrps,) {

   const navigate = useNavigate()
   const initialValues: ProjectFormData = {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description
   }
   const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

   const queryClient = useQueryClient() // Esto nos permitira acceder a los datos del cache de react-query para invalidar los datos
   const { mutate } = useMutation({
      mutationFn: updateProject,
      onError: (error) => {
         toast.error(error.message)
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries({queryKey: ['projects']}) // Invalidamos la informacion que ya teniamos para forzar una informacion nueva
         queryClient.invalidateQueries({queryKey: ['editProject', projectId]}) // Invalidamos el cache del proyecto en especifico para cuando ingresemos no nos devuelva los datos anteriores
         toast.success(data)
         navigate('/')
      }
   })

   const handleForm = (formData: ProjectFormData) => {
      const data = {
         formData,
         projectId
      }
      mutate(data)
   }

   return (
      <>
         <div className="max-w-3xl mx-auto ">
            <h1 className="text-5xl font-black">Editar Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>
            <nav className="my-5">
               <Link
                  className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                  to={'/'}
               >Regresar a mis Proyectos</Link>
            </nav>
            <form action=""
               className="mt-10 bg-white shadow-lg p-10 rounded-lg"
               onSubmit={handleSubmit(handleForm)}
               noValidate /* Deshabilitamos la validacion de html5 */
            >

               <ProjectForm
                  register={register}
                  errors={errors}
               />

               <input
                  type="submit"
                  value={'Guardar Cambios'}
                  className='bg-fuchsia-600 hover:bg-fuchsia-700 text-white w-full p-3 uppercase font-bold cursor-pointer transition-colors'
               />
            </form>
         </div>
      </>
   )
}
