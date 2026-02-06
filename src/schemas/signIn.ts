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

export const alterPasswordSchema = z.object({
    senha: z.string().min(1, 'A nova senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
    repitaSenha: z.string().min(1, 'Repetir a senha é obrigatório').min(6, 'A repetir asenha deve ter no mínimo 6 caracteres'),
    senhaAnterior: z.string().min(1, 'A senha anterior é obrigatória').min(6, 'A senha anterior deve ter no mínimo 6 caracteres')
}).refine((data) => data.senha === data.repitaSenha, {
    message: "As senhas não conferem",
    path: ["repitaSenha"]
});

export type AlterPasswordSchema = z.infer<typeof alterPasswordSchema>;