import { getUser } from "@/api/AuthAPI";
import { useQuery } from '@tanstack/react-query'

export const useAuth = () => {

    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'], // la key que guardara 
        queryFn: getUser, // Funcion a utilizar
        retry: 1, // Que no lo reintente para hacer la app mas rapida
        refetchOnWindowFocus: false // Deshbilitamos el refetch cuando se regresa a la pestaña
    })

    return {data, isError, isLoading}
}