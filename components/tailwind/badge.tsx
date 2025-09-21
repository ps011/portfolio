export default function Badge({text, className} : {text: string, className?: string}) {
    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
            style={{
                backgroundColor: "var(--theme-primary-100)",
                color: "var(--theme-primary-700)",
                ringColor: "var(--theme-primary-700)"
            }}
        >
        {text}
            </span>
    );
}
