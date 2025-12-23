import {z} from "zod"

const userSchemaValidator = z.object({
    name: z.string().min(2),
    email: z.email(),
    pass: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "La contraseña debe tener al menos 8 caracteres, una letra y un número")
})

export const createUserSchema = userSchemaValidator
export const updateUserSchema = userSchemaValidator.partial()