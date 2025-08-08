import { z } from 'zod'

/** ---------- Auth & Users----------- */
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    currentPassword: z.string(),
    password: z.string(),
    passwordConfirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email'|'password'>
export type UserRegistrationForm = Pick<Auth, 'name'|'email'|'password'|'passwordConfirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password'|'passwordConfirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'currentPassword'|'password'|'passwordConfirmation'>
export type ConfirmToken = Pick<Auth, 'token'>
export type CheckPasswordForm = Pick<Auth, 'password'>

/** ------------------------------------- USERS -------------------------------*/
export const userSchema = authSchema.pick({ /* Seleccionamos los valores que unicamente necesitamos para crear este Schema */
    name: true,
    email: true,
}).extend({ // Y le extendemos con un valor adicional que necesitamos como el id que no lo tiene el authSchema
    _id: z.string()
})

export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name'|'email'>


/** ------------------------------------- NOTES -------------------------------*/
const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})
export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'>

/** ------------------------------------- TASKS -------------------------------*/
export const taskStatusSchema = z.enum(["pending" , "onHold" , "inProgress" , "underReview" , "complete"])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema, // z.enum(["pending" , "onHold" , "inProgress" , "underReview" , "complete"])
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),// Puede ser null cuando este en "Pendiente" la tarea
    notes: z.array(noteSchema),
    createdAt: z.string(),
    updatedAt: z.string()
})
export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    status: true,
    description: true
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>

/** ------------------------------------- PROJECTS -------------------------------*/
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string())
})
export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)
export const editProjectSchem = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true
})

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'> /* Creamos un type Draft sin el id teniendo de referenciael anterior */

/** ------------------------------------- TEAM -------------------------------*/
export const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)

export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>