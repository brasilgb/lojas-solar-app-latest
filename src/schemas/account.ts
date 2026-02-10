import z from "zod";

export const accountSchema = z.object({
    cpfcnpj: z.string().optional(),
    nomeCliente: z.string().min(1, 'O nome é obrigatório'),
    enderecoCliente: z.string().min(1, 'O endereço é obrigatório'),
    cepCliente: z.string().min(1, 'O CEP é obrigatório'),
    cidadeCliente: z.string().min(1, 'A cidade é obrigatória'),
    ufCliente: z.string().min(1, 'O estado é obrigatório'),
    celularCliente: z.string().min(1, 'O celular é obrigatório'),
    emailCliente: z.email('O email é inválido'),
    nascimentoCliente: z.string().optional(),
});
export type AccountSchema = z.infer<typeof accountSchema>;

export const excludeDataSchema = z.object({
    motivo: z.string().min(20, 'Deve ter no mínimo 20 caracteres.'),
    emailCliente: z.email("Digite um e-mail válido."),
    celularCliente: z.string().min(1, 'O celular é obrigatório')
});
export type ExcludeDataSchema = z.infer<typeof excludeDataSchema>;