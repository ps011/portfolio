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
      <div className="tw-flex tw-flex-col-reverse tw-justify-around tw-items-center md:tw-flex-row tw-container">
        <div className="tw-flex-1">
          {interests.length && interests.map((interest) => (
            <HorizontalCard
              key={interest.title}
              title={interest.title}
              description={interest.description}
            />
          ))}
        </div>
        <div className="tw-flex-1 tw-pb-4 md:tw-pb-0">
            <Image height={0} width={0} src={illustration} alt="Interests" className="tw-w-full tw-h-full" />
        </div>
      </div>
  </Section>
);

export default Interests;
