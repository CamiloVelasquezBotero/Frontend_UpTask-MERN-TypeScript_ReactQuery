import { Navigate, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"

export default function EditProjectView() {

    const params = useParams()
    const projectId = params.projectId!
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['editProject', projectId], /* Como son varias ediciones, le pasamos el projectId para que lo detecte como unico */
        queryFn: () => getProjectById(projectId),
        retry: false // Si no se puede hacer la conexion entonces no lo intentes mas
    })

    if(isLoading) return 'Cargando'
    if(error) return <Navigate to='/404' />

   if(data) return <EditProjectForm data={data} projectId={projectId} />
}
