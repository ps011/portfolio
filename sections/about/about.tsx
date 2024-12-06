import Image from "next/image";
import Badge from "../../components/tailwind/badge";
import Section from "../../components/tailwind/section";
import Profile from "../../components/profile/profile";
import Tabs, {TabData} from "../../components/tailwind/tabs";

interface AboutProps {
    about: string;
    skills: { logo: string; name: string }[];
    experience: {
        logo: string;
        designation: string;
        company: string;
        from: string;
        to: string;
        location: string;
        technologies: string[];
    }[];
    imageUrl: string;
    name: string;
    location: string;
    designation: string;
    education: string;
    stats: { count: number; label: string }[];
    profiles: { name: string; url: string }[];

}

const About = ({
                   name, about, imageUrl, location, designation, experience, education, skills, stats, profiles,
               }: AboutProps) => {

    const tabsData: TabData[] = [
        {
            name: "Skills",
            content: (
                <>
                    {skills.length && skills.map((skill) => (
                        <Image
                            height={85}
                            width={100}
                            key={skill.logo}
                            className="tw-inline-block tw-m-4"
                            src={skill.logo}
                            alt={skill.name}
                        />
                    ))}
                </>
            ),
        },
        {
            name: "Experience",
            content: (<div className="tw-flex tw-flex-col tw-items-center">
                            {experience.length && experience.map((company, index) => (
                        <div className="tw-flex tw-flex-col tw-justify-between tw-items-center tw-shadow-md tw-rounded-xl tw-p-4 tw-my-4 md:tw-flex-row tw-max-w-lg dark:tw-bg-gray-600" key={index}>
                            <div className="tw-mb-8 md:tw-mb-0">
                                <Image height={60} width={100} src={company.logo}
                                       alt="Company Logo"/>
                            </div>
                            <div className="tw-flex tw-flex-col tw-flex-1">
                                <div className="dark:tw-text-white">
                                    <h4 className="tw-mb-0">
                                        {company.designation}
                                        {" "}
                                        @
                                        {" "}
                                        {company.company}
                                    </h4>
                                    <p className="text-muted tw-mb-0">
                                        {" "}
                                        <small>
                                            (
                                            {" "}
                                            {company.from}
                                            {" "}
                                            -
                                            {company.to}
                                            {" "}
                                            )
                                        </small>
                                    </p>
                                </div>
                                <p className="tw-my-2 dark:tw-text-white">
                                    <i className="ni ni-pin-3 tw-mr-2"/>
                                    {" "}
                                    {company.location}
                                </p>
                                <div>
                                {company.technologies && company.technologies.map((technology) =>
                                    <Badge key={technology} text={technology} className="tw-m-1 dark:tw-bg-dark-primary-300 tw-text-primary-gray-300"/>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            name: "About",
            content: <div className="dark:tw-text-white"
                dangerouslySetInnerHTML={{ __html: about }}
            />,
        },
    ];

    return (
        <Section container id="about">
            <div className="tw-shadow-2xl tw-rounded tw-px-4">
                <div className="tw-flex tw-flex-col tw-justify-between tw-items-center lg:tw-flex-row">
                    <div className="tw-flex-1 tw-mb-4 lg:tw-mb-0 tw--mt-12 lg:tw-order-2">
                        <Image
                            src={imageUrl}
                            className="tw-rounded-full tw-block tw-mx-auto tw-h-48 tw-w-48 tw-min-w-48"
                            alt="dp"
                            sizes="100vw"
                            width={0}
                            height={0}
                        />
                    </div>
                    <div className="tw-flex-1 lg:tw-order-1">
                        <div className="tw-flex">
                            {stats.length && stats.map((stat) => (
                                <div key={stat.label} className="tw-mx-4 tw-text-center">
                                    <span className="tw-font-bold tw-block tw-text-3xl  dark:tw-text-white">{stat.count}</span>
                                    <span className="tw-text-xs tw-text-neutral-500 dark:tw-text-gray-400">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="tw-flex-1 lg:tw-order-3">
                        <div className="tw-py-4 tw-flex tw-justify-center">
                            {profiles.length && profiles.map((profile) => (
                                <Profile url={profile.url} name={profile.name} key={profile.name}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="tw-text-center tw-mt-4">
                    <h3 className="tw-text-3xl tw-mb-6 dark:tw-text-white">
                        {name}
                    </h3>
                    <div className="tw-font-semibold tw-text-neutral-400">
                        <i className="fa fa-map-pin mr-2"/>
                        {location}
                    </div>
                    <div className="dark:tw-text-white">
                        <i className="fa fa-briefcase mr-2 "/>
                        {designation}
                    </div>
                    <div className="dark:tw-text-white">
                        <i className="fa fa-graduation-cap mr-2"/>
                        {education}
                    </div>
                </div>
                <div className="tw-mt-2 tw-pt-2 tw-border-t-2 tw-text-center">
                    <div className="tw-flex tw-flex-col tw-justify-center md:tw-mx-8">
                        <Tabs tabs={tabsData} className="tw-container"/>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;
