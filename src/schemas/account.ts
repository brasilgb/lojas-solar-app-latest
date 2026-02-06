import z from "zod";

export const accountSchema = z.object({
    cpfcnpj: z.string().optional(),
    nomeCliente: z.string().min(1, 'O nome é obrigatório'),
    enderecoCliente: z.string().min(1, 'O endereço é obrigatório'),
    cepCliente: z.string().min(1, 'O CEP é obrigatório'),
    bairroCliente: z.string().min(1, 'O bairro é obrigatório'),
    cidadeCliente: z.string().min(1, 'A cidade é obrigatória'),
    ufCliente: z.string().min(1, 'O estado é obrigatório'),
    celularCliente: z.string().min(1, 'O telefone é obrigatório'),
    emailCliente: z.string().min(1, 'O email é obrigatório'),
    nascimentoCliente: z.string().optional(),
});
export type AccountSchema = z.infer<typeof accountSchema>;