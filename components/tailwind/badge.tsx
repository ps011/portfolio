export default function Badge({text, className} : {text: string, className?: string}) {
    return (
        <span
            className={`tw-inline-flex tw-items-center tw-rounded-md tw-bg-blue-50 tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-text-blue-700 tw-ring-1 tw-ring-inset tw-ring-blue-700/10 ${className}`}>
        {text}
            </span>
    );
}
