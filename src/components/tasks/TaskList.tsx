import { DndContext } from '@dnd-kit/core' // El context que usaremos para decirle a dnd donde estara el html para usarlo
import type { DragEndEvent } from '@dnd-kit/core' // Types de @dnd-kit/core
import type { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStatus } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

type TaskListProps = {
    tasks: TaskProject[],
    canEdit: boolean
}

type GroupedTasks = {
    [key: string]: TaskProject[]
}
const initialStatusGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    complete: []
}

const statusStyles:{[key:string]: string} = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    complete: 'border-t-emerald-500'
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams()
    const projectId = params.projectId!

    // React-Query useQueryClient
    const queryClient = useQueryClient()
    // React-Query useMutation
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
        }
    })

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task] // TODO: Repasar
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);

    const handleDragEnd = (editTask:DragEndEvent) => {
        // Extraemos el (active) que nos dara el id de la task, y (over) que nos dira donde fue que se solto
        const { over, active } = editTask
        // Comprobamos si si se solto en algun droppable que tendra el id en el over
        if(over && over.id) {
            const taskId = active.id.toString() // Instanciamos el id de la tarea gracias a active de dnd
            const status = over.id as TaskStatus // Instanciamos el status gracias a over, ya que le pusismos su estado como ID
            // Hacemos la mutacion
            mutate({projectId, taskId, status})

            /* Utiliamos (setQueryData) el cual nos sirve para actualizar los datos de manera mas inmediata
            y es una forma de no usar los (invalidateQueryes) para no esperar que haga de nuevo la peticion si no que nosotros mismos
            le ayudamos a setear los datos para hacerlo de manera inmediata */
            queryClient.setQueryData(['project', projectId], (oldData:Project) => {
                const updatedTasks = oldData.tasks.map((task) => {
                    if(task._id === taskId) { // Verificamos si es la misma tarea que modificamos
                        return {
                            ...task, // Tomamos la copia de toda la tarea y...
                            status // Le cambiamos al nuevo estado
                        }
                    }
                    return task // Retornamos las que no se hayan modificado
                })
                return { // Al usar (setQueryData) siempre tenemos que retornar lo que actualizamos
                    ...oldData, // Tomamos una copia de los datos viejos para no perder los colaboradores y el proyecto como tal
                    tasks: updatedTasks // y en las tareas que es lo que queriamos actualizar le agregamos las nuevas con la que actualizamos
                }
            })
        } 
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>

                {/* DndContext - tiene varios props que se le pueden pasar entre esos esta el de soltar (onDragEnd) */}
                <DndContext onDragEnd={handleDragEnd}> {/* Elegimos el prop que se usa la soltar  para pasarle el handle */}
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
                            >{statusTranslations[status]}</h3>

                            <DropTask status={status}/>
                    
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit}/>)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}
