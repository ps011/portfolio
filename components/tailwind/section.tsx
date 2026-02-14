import React from "react";

interface SectionProps {
    children: React.ReactNode;
    id: string;
    background?: "primary" | "secondary";
    container?: boolean;
    heading?: string;
}

const Section = ({ children, id, background, container, heading }: SectionProps) => {
  return (
    <section
      id={id}
      className={[
        "mb-16 p-4 md:p-8",
        background === "primary" ? "bg-secondary-background" : "bg-background",
        container ? "container" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {heading && (
        <h3 className="font-heading my-4 text-center text-2xl font-bold text-foreground">
          {heading}
        </h3>
      )}
      {children}
    </section>
  );
};

export default Section;
