import React from "react";

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
            className={`mb-16 p-8 ${container ? "container" : ""}`}
            style={{ 
                backgroundColor: background === "primary" 
                    ? 'var(--theme-primary-100)' 
                    : 'var(--theme-tertiary-50)'
            }}
        >
            {heading &&  <h3 className="text-center my-4 text-2xl font-weight-600 dark:text-white">{heading}</h3>}
            {children}
        </section>
    );
};

export default Section;
