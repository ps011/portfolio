interface SectionProps {
    children: React.ReactNode;
    id: string;
    background?: "primary" | "secondary";
    container?: boolean;
    heading?: string;

}

const Section = ({children, id, background, container, heading}: SectionProps) => {
    return (
        <section
            id={id}
            className={`
            tw-mb-16 tw-p-8
            ${background === "primary" ? "tw-bg-primary-100" : "tw-bg-white"}
            ${container ? "tw-container" : ""}`}
        >
            {heading &&  <h3 className="tw-text-center tw-my-4 tw-text-2xl tw-font-weight-600">{heading}</h3>}
            {children}
        </section>
    );
};

export default Section;
