import HorizontalCard from "../../components/horizontal-card/horizontal-card";
import s from "./interests.module.scss";
import Image from "next/image";

interface InterestsProps {
    illustration: string;
    interests: {
        title: string;
        description: string;
    }[];

}
const Interests = ({ illustration, interests }: InterestsProps) => (
  <section className="section pb-0 bg-primary" id="interests">
    <div className="container">
      <div className="row row-grid align-items-center">
        <div className="col-md-6 order-lg-2 ml-lg-auto">
          <div className="position-relative pl-md-3">
            <Image height={500} width={500} src={illustration} className="img-fluid" alt="Interests" />
          </div>
        </div>
        <div className="col-lg-6 order-lg-1 mb-5">
          {interests.length && interests.map((interest) => (
            <HorizontalCard
              key={interest.title}
              title={interest.title}
              description={interest.description}
              type="dark"
            />
          ))}
        </div>
      </div>
    </div>
    <div className="separator separator-bottom separator-skew zindex-100">
      <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <polygon className={s.fillWhite} points="2560 0 2560 100 0 100" />
      </svg>
    </div>
  </section>
);

export default Interests;
