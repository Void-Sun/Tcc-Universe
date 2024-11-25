import z from "zod";

export const userSchema = z.object({    
    login: z.string().email(),
    password: z.string().min(8),
})	

export const valit = (data: any) => {
    return userSchema.safeParse(data)
}