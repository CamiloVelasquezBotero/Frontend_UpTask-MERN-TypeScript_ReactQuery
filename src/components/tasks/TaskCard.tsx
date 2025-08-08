import { Fragment } from 'react/jsx-runtime'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TaskProject } from "@/types/index"
import { deleteTask } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import { useDraggable } from '@dnd-kit/core'

type TaskCardProps = {
    task: TaskProject,
    canEdit: boolean
}

export default function TaskCard({ task, canEdit }: TaskCardProps) {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({ // A este draggable se le pasa obligatoriamente un ID del elemento que movera
        id: task._id
    })
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    // React-Query
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
        }
    })

    // Usaremos CSS Nativo para darle los estilos con el transform de DND
    const style = transform ? { // Cuando se este moviendo...
        // transform: `translateY(${transform.x}px)` // - Esto solo nos dejara Horizontalmente
        transform: `translate3d(${transform.x}px,${transform.y}px, 0)`, // Trasladamos de manera 3D
        // Le agregamos los sigueintes estilos para que simule el fondo de todo el card al moverlo
        padding: "1.25rem",
        backgroundColor: "#FFF",
        width: '300px',
        display: 'flex',
        borderWidth:'1px',
        borderColor: 'rgb(203 213 225 / var(--tw-border-opacity))'
    } : undefined

    return (
        <li className={`p-5 bg-white border border-slate-300 flex justify-between gap-3`}>
            <div 
                className="min-w-0 flex flex-col gap-y-4"
                /* Les pasamos a este div lo escnecial de (dnd) para poder arrastrar el componente y le pasamos la referencia */
                    {...listeners} // Los listeners seran las funciones para poderlo escuchar al mover
                    {...attributes} // lo que necesitara
                    ref={setNodeRef} // La referencia a este div
                    style={style} // Los styles del transform
            >
                <p
                    className="text-xl font-bold text-slate-600 text-left cursor-pointer"
                >{task.name}</p>
                <p className="text-slate-500">{task.description}</p>
            </div>

            <div className="flex shrink-0  gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                                <button 
                                    type='button' 
                                    className='block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                    onClick={() => navigate('' + `?viewTask=${task._id}`)}
                                >
                                    Ver Tarea
                                </button>
                            </Menu.Item>
                            {canEdit && (
                                <>
                                    <Menu.Item>
                                        <button 
                                            type='button' 
                                            className='block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                            onClick={() => navigate('' + `?editTask=${task._id}`)} /* Direccion actual, y le agregamos lo sigueinte.... cursor-pointer */
                                        >
                                            Editar Tarea
                                        </button>
                                    </Menu.Item>

                                    <Menu.Item>
                                        <button 
                                            type='button' 
                                            className='block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer'
                                            onClick={() => mutate({projectId, taskId: task._id})}
                                        >
                                            Eliminar Tarea
                                        </button>
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </li>
    )
}
