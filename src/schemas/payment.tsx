import z from "zod";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const CartPaymentSchema = z.object({
    numeroCartao: z
        .string()
        .min(1, { message: 'Informe o número do cartão' })
        .refine(value => {
            const digits = onlyDigits(value);
            return digits.length >= 13 && digits.length <= 19;
        }, { message: 'Informe um número de cartão válido' }),
    nomeCartao: z
        .string()
        .trim()
        .min(3, { message: 'Informe o nome do titular' }),
    validadeCartao: z
        .string()
        .min(1, { message: 'Informe a data de validade' })
        .refine(value => {
            const digits = onlyDigits(value);
            if (digits.length !== 4) return false;

            const month = Number(digits.slice(0, 2));
            const year = Number(`20${digits.slice(2)}`);
            if (month < 1 || month > 12) return false;

            const now = new Date();
            const expiration = new Date(year, month, 0, 23, 59, 59);
            return expiration >= now;
        }, { message: 'Informe uma validade válida' }),
    cvvCartao: z
        .string()
        .min(1, { message: 'Informe o CVV' })
        .refine(value => {
            const digits = onlyDigits(value);
            return digits.length === 3 || digits.length === 4;
        }, { message: 'Informe um CVV válido' }),
});
export type CartPaymentFormType = z.infer<typeof CartPaymentSchema>;
