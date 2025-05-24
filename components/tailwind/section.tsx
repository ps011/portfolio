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
            mb-16 p-8
            ${background === "primary" ? "bg-brandMutedYellow-100 dark:bg-neutralGray-800" : "bg-white dark:bg-neutralGray-700"}
            ${container ? "container" : ""}`.trim().replace(/\s+/g, ' ')}
        >
            {heading &&  <h3 className="text-center my-4 text-2xl font-weight-600 dark:text-white">{heading}</h3>}
            {children}
        </section>
    );
};

export default Section;
