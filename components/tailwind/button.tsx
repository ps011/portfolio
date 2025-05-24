import { ReactNode } from "react";
import { Button as MantineButton, MantineColor, ButtonVariant } from "@mantine/core";

interface ButtonProps {
    children: ReactNode;
    variant: ButtonVariant;
    fullWidth?: boolean;
    className?: string;
    onClick?: () => void;
}

export default function Button({ children, variant, fullWidth, className, onClick }: ButtonProps) {
    return (
        <MantineButton
            variant={variant}
            fullWidth={fullWidth}
            onClick={onClick}
        >
            {children}
        </MantineButton>
    );
}
