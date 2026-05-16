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
        "flex min-h-[calc(100svh-74px)] scroll-mt-[74px] flex-col justify-center p-4 md:min-h-[calc(100svh-106px)] md:scroll-mt-[106px] md:p-8",
        background === "primary" ? "bg-secondary-background" : "bg-background",
        container ? "container" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {heading && (
        <h3 className="my-4 text-left text-2xl font-bold text-foreground">
          {heading}
        </h3>
      )}
      {children}
    </section>
  );
};

export default Section;
