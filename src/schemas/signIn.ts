import { z } from "zod";

export const sigInSchema = z.object({
    cpfcnpj: z.string().min(1, 'O CPF/CNPJ é obrigatório')
});
export type SigInSchema = z.infer<typeof sigInSchema>;

export const checkPasswordSchema = z.object({
    senha: z.string().min(1, 'A senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
    connected: z.boolean().default(false).optional()
});
export type CheckPasswordSchema = z.infer<typeof checkPasswordSchema>;