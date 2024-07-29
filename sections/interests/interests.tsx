import HorizontalCard from "../../components/horizontal-card/horizontal-card";
import Image from "next/image";

interface InterestsProps {
    illustration: string;
    interests: {
        title: string;
        description: string;
    }[];

}
const Interests = ({ illustration, interests }: InterestsProps) => (
  <section className="pb-0 bg-primary" id="interests">
    <div className="tw-container">
      <div className="row row-grid align-items-center">
        <div className="col-md-6 order-lg-2 ml-lg-auto">
          <div className="position-relative pl-md-3">
            <Image height={500} width={500} src={illustration} alt="Interests" />
          </div>
        </div>
        <div className="col-lg-6 order-lg-1 mb-5">
          {interests.length && interests.map((interest) => (
            <HorizontalCard
              key={interest.title}
              title={interest.title}
              description={interest.description}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Interests;
