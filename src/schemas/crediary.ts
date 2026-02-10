import z from "zod";

export const crediarySchema = z.object({
    nomeMae: z.string().min(1, 'O nome da mãe é obrigatório'),
    sexo: z.string().min(1, 'O sexo é obrigatório'),
    escolaridade: z.string().min(1, 'A escolaridade é obrigatória'),
    localTrabalho: z.string().min(1, 'O local de trabalho é obrigatório'),
    estadoCivil: z.string().min(1, 'O estado cívil é obrigatório'),
    nomeConjuge: z.string().min(1, 'O conjuge é obrigatório'),
    cpfConjuge: z.string().min(1, 'O CPF conjuge é obrigatório'),
    profissao: z.string().min(1, 'A profissão é obrigatória'),
    renda: z.string().min(1, 'O CPF conjuge é obrigatório'),
});
export type CrediarySchema = z.infer<typeof crediarySchema>;