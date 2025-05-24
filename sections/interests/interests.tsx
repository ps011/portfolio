import HorizontalCard from "../../components/horizontal-card/horizontal-card";
import Image from "next/image";
import Section from "../../components/tailwind/section";

interface InterestsProps {
    illustration: string;
    interests: {
        title: string;
        description: string;
    }[];

}
const Interests = ({ illustration, interests }: InterestsProps) => (
  <Section background="primary"  id="interests">
      <div className="flex flex-col-reverse justify-around items-center md:flex-row container">
        <div className="flex-1">
          {interests.length && interests.map((interest) => (
            <HorizontalCard
              key={interest.title}
              title={interest.title}
              description={interest.description}
            />
          ))}
        </div>
        <div className="flex-1 pb-4 md:pb-0">
            <Image height={0} width={0} src={illustration} alt="Interests" className="w-full h-full" />
        </div>
      </div>
  </Section>
);

export default Interests;
