import z from "zod";

export const CartPaymentSchema = z.object({
    numeroCartao: z.string().min(1, {message: 'Informe o número do cartão'}),
    nomeCartao: z.string().min(1, {message: 'Informe o nome do titular'}),
    validadeCartao: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, { message: 'Use o formato MM/AAAA' }),
    cvvCartao: z.string().min(1, {message: 'Informe o código de segurança'}),
});
export type CartPaymentFormType = z.infer<typeof CartPaymentSchema>;
