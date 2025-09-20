import { ReactNode } from "react";
import { Button as MantineButton, ButtonVariant } from "@mantine/core";

interface ButtonProps {
    children: ReactNode;
    variant: ButtonVariant;
    fullWidth?: boolean;
    onClick?: () => void;
}

export default function Button({ children, variant, fullWidth, onClick }: ButtonProps) {
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
