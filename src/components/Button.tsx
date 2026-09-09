import {type VariantProps, cva} from 'class-variance-authority';
import {Text, TouchableOpacity, View} from 'react-native';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
    'flex flex-row items-center justify-center rounded-md',
    {
        variants: {
            variant: {
                default: 'bg-solar-blue-primary',
                secondary: 'bg-solar-orange-primary',
                destructive: 'bg-solar-orange-secondary',
                ghost: 'bg-slate-700',
                link: 'text-primary underline-offset-4',
            },
            size: {
                default: 'h-14 px-4',
                sm: 'h-8 px-2',
                lg: 'h-12 px-8',
                icon: 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const buttonTextVariants = cva('text-center font-medium', {
    variants: {
        variant: {
            default: 'text-white font-bold',
            secondary: 'text-secondary-foreground',
            destructive: 'text-destructive-foreground',
            ghost: 'text-primary-foreground',
            link: 'text-primary-foreground underline',
        },
        size: {
            default: 'text-lg',
            sm: 'text-sm',
            lg: 'text-xl',
            icon: 'size-9',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

interface ButtonProps
    extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
        VariantProps<typeof buttonVariants> {
    label: any;
    labelClasses?: string;
}
function Button({
    label,
    labelClasses,
    className,
    variant,
    size,
    ...props
}: ButtonProps) {
    const isTextLabel = typeof label === 'string' || typeof label === 'number';

    return (
        <TouchableOpacity
            className={cn(buttonVariants({variant, size, className}))}
            {...props}
        >
            {isTextLabel ? (
                <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    numberOfLines={1}
                    className={cn(
                        'flex-shrink',
                        buttonTextVariants({variant, size, className: labelClasses}),
                    )}
                >
                    {label}
                </Text>
            ) : (
                // `Text` doesn't center a non-text child (e.g. an icon), so give it its own
                // flex box instead of relying on `buttonTextVariants`' text-alignment classes.
                <View
                    className={cn(
                        'items-center justify-center',
                        buttonTextVariants({variant, size, className: labelClasses}),
                    )}
                >
                    {label}
                </View>
            )}
        </TouchableOpacity>
    );
}

export {Button, buttonVariants, buttonTextVariants};
