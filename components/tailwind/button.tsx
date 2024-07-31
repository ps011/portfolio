import {ReactNode} from "react";

interface ButtonProps {
    children: ReactNode;
    role: "primary" | "secondary";
    fullWidth?: boolean;
    className?: string;
}
export default function Button({ children, role, fullWidth, className}: ButtonProps) {
    switch (role) {
        case "primary":
            return (
                <button className={`tw-bg-primary-100 tw-text-white tw-py-2 tw-px-5 tw-rounded tw-uppercase hover:tw-bg-primary-200 ${fullWidth && "tw-w-full"} ${className}`}>
                    {children}
                </button>
            );
        case "secondary":
            return (
                <button className={`tw-bg-secondary-100 tw-text-black tw-py-2 tw-px-5 tw-rounded tw-uppercase hover:tw-text-black hover:tw-bg-secondary-200  ${fullWidth && "tw-w-full"} } ${className}`}>
                    {children}
                </button>
            );
    }
}
