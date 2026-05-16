import React from "react";

interface SectionProps {
    children: React.ReactNode;
    id: string;
    background?: "primary" | "secondary";
    container?: boolean;
    heading?: string;
}

const Section = ({ children, id, background, container, heading }: SectionProps) => {
  const inner = (
    <>
      {heading && (
        <h3 className="my-4 text-left text-2xl font-bold text-foreground">
          {heading}
        </h3>
      )}
      {children}
    </>
  );

  return (
    <section
      id={id}
      className={[
        "flex min-h-[calc(100svh-74px)] w-full scroll-mt-[74px] flex-col justify-center border-b-2 border-border p-4 md:min-h-[calc(100svh-106px)] md:scroll-mt-[106px] md:p-8",
        background === "primary" ? "bg-secondary-background" : "bg-background",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {container ? <div className="container mx-auto w-full">{inner}</div> : inner}
    </section>
  );
};

export default Section;
