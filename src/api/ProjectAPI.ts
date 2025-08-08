import api from "@/lib/axios";
import { dashboardProjectSchema, editProjectSchem, projectSchema, type Project, type ProjectFormData } from "../types";
import { isAxiosError } from "axios";

export async function createProject(formData:ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData)
        return data
    } catch (error) {
        // Comprobamos que si sea un error de axios, y que si contenga el response desde la api para poderlo mandar
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) /* Lanzamos el Error para que caiga en el onError de React-Query */
        }
    }
}

export async function getProjects() {
    //const token = localStorage.getItem('AUTH_TOKEN') // Instanaciamos el token JWT para la autorizacion
    try {
        const { data } = await api('/projects' 
            // { /* Le pasamoe el JWTTOKEN en lsos headers, pero esto lo hicimos con un interceptor de axios, por 
            //  lo que en cada request, va a enviar este header que ya esta configurado en (/lib/axios.ts)*/
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // }
        )
        const response = dashboardProjectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) 
        }
    }
}

export async function getProjectById(id:Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = editProjectSchem.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) 
        }
    }
}

export async function getFullProject(id:Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) 
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData,
    projectId: Project['_id']
}
export async function updateProject({formData, projectId}:ProjectAPIType) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) 
        }
    }
}

export async function deleteProject(id:Project['_id']) {
    try {
        const { data } = await api.delete<string>(`/projects/${id}`)
        return data
    } catch (error) {
        if(isAxiosError(error)) {
            throw new Error(error.response?.data.error)
        }
    }
}
