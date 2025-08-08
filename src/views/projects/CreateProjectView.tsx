import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useMutation } from "@tanstack/react-query"
import ProjectForm from "@/components/projects/ProjectForm"
import type { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"

export default function CreateProjectView() {

   const navigate = useNavigate()
   const initialValues:ProjectFormData = {
       projectName: "",
       clientName: "",
       description: ""
   }
   const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})

   const mutation = useMutation({
      mutationFn: createProject,
      onError: (error) => { // (data) retorna el error que viene desde create project
         toast.error(error.message)
      },
      onSuccess: (data) => { /* (data) retorna la data que viene desde create project */
         toast.success(data)
         navigate('/')
      }
   })

   const handleForm = (formData:ProjectFormData) => {
      mutation.mutate(formData) // (mutate) maneja todo asyncrono automaticamente
      // const data = await createProject(formData)
      // toast.success(data)
      // navigate('/') 
   }

  return (
    <>
      <div className="max-w-3xl mx-auto ">
         <h1 className="text-5xl font-black">Crear Proyecto</h1>
         <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un nuevo proyecto</p>
         <nav className="my-5">
            <Link
               className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
               to={'/'}
            >Volver a Proyectos</Link>
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
               value={'Crear Proyecto'}
               className='bg-fuchsia-600 hover:bg-fuchsia-700 text-white w-full p-3 uppercase font-bold cursor-pointer transition-colors'
            />
         </form>
      </div>
   </>
  )
}
