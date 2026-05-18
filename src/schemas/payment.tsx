import z from "zod";

export const CartPaymentSchema = z.object({
    numeroCartao: z.string().min(1, { message: 'Informe o número do cartão' }),
    nomeCartao: z.string().min(1, { message: 'Informe o nome do titular' }),
    validadeCartao: z.string().min(1, { message: 'Informe a data de validade' }),
    cvvCartao: z.string().min(1, { message: 'Informe o CVV' }),
});
export type CartPaymentFormType = z.infer<typeof CartPaymentSchema>;
