import { Navigate, useLocation, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getTaskById } from "@/api/TaskAPI"
import EditTaskModal from "./EditTaskModal"

export default function EditTaskData() {

    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!

    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId // Lo convertimos a booleano si tiene algo, y si esta vacio entonces sera un false, para habilitar la consulta si si tenemos el taskId
    })

    if(isError) return <Navigate to={'/404'} />

  if(data) return <EditTaskModal data={data} taskId={taskId}/> 
}
