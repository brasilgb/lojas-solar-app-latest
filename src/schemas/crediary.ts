import z from "zod";

export const crediarySchema = z.object({
    nomeMae: z.string().min(1, 'O nome da mãe é obrigatório'),
    sexo: z.string().min(1, 'O sexo é obrigatório'),
    escolaridade: z.string().min(1, 'A escolaridade é obrigatória'),
    localTrabalho: z.string().min(1, 'O local de trabalho é obrigatório'),
    estadoCivil: z.string().min(1, 'O estado cívil é obrigatório'),
    nomeConjuge: z.string().optional(),
    cpfConjuge: z.string().optional(),
    profissao: z.string().min(1, 'A profissão é obrigatória'),
    renda: z.string().min(1, 'O CPF conjuge é obrigatório'),
}).superRefine((data, ctx) => {
    if (data.estadoCivil?.toUpperCase() === 'CASADO') {

        if (!data.nomeConjuge || data.nomeConjuge.trim().length < 3) {
            ctx.addIssue({
                code: 'custom', // Use a string 'custom' em vez do Enum depreciado
                message: "Nome do cônjuge é obrigatório",
                path: ['nomeConjuge'],
            });
        }

        if (!data.cpfConjuge || data.cpfConjuge.length < 11) {
            ctx.addIssue({
                code: 'custom',
                message: "CPF do cônjuge inválido ou obrigatório",
                path: ['cpfConjuge'],
            });
        }
        
    }
});
export type CrediarySchema = z.infer<typeof crediarySchema>;