import z from "zod";

export const getSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})	

export const valit = (data: any) => {
    return getSchema.safeParse(data)
}