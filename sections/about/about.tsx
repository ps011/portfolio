import {useRef, useEffect} from "react";
import Image from "next/image";
import Badge from "../../components/tailwind/badge";

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
    const aboutTabContent = useRef(null);
    const skillsTabContent = useRef(null);
    const experienceTabContent = useRef(null);
    const aboutTab = useRef(null);
    const skillsTab = useRef(null);
    const experienceTab = useRef(null);
    const aboutRef = useRef(null);

    useEffect(() => {
        aboutRef.current.innerHTML = about;
    }, [about]);
    const activateTab = (contentRef, tabRef?) => {
        aboutTabContent.current.classList.remove("active");
        skillsTabContent.current.classList.remove("active");
        experienceTabContent.current.classList.remove("active");
        aboutTab.current.classList.remove("active");
        skillsTab.current.classList.remove("active");
        experienceTab.current.classList.remove("active");
        contentRef.current.classList.add("active");
        tabRef.current.classList.add("active");
    };
    return (
        <section className="section tw-container tw-mx-auto" id="about">
            <div className="tw-shadow-2xl tw-rounded tw-px-4">
                <div className="tw-flex tw-flex-col tw-justify-between tw-items-center md:tw-flex-row">
                    <div className="tw-flex-1 tw-mb-4 md:tw-mb-0 md:tw--mt-12 md:tw-order-2">
                        <Image
                            src={imageUrl}
                            className="tw-rounded-full tw-block tw-mx-auto"
                            alt="dp"
                            width={200}
                            height={180}
                        />
                    </div>
                    <div className="tw-flex-1 md:tw-order-1">
                        <div className="tw-flex">
                            {stats.length && stats.map((stat) => (
                                <div key={stat.label} className="tw-mx-4 tw-text-center">
                                    <span className="tw-font-bold tw-block tw-text-3xl">{stat.count}</span>
                                    <span className="tw-text-xs tw-text-neutral-500">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="tw-flex-1 md:tw-order-3">
                        <div className="tw-py-4 tw-flex tw-justify-around">
                            {profiles.length && profiles.map((profile) => (
                                <a href={profile.url} key={profile.name} target="_blank" rel="noreferrer"
                                   className={`btn btn-${profile.name} btn-sm tw-mx-4`}>
                                    <i className={`fa fa-${profile.name}`}/>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="tw-text-center tw-mt-2">
                    <h3 className="tw-text-3xl tw-mb-6">
                        {name}
                    </h3>
                    <div className="tw-font-semibold tw-text-neutral-400">
                        <i className="fa fa-map-pin mr-2"/>
                        {location}
                    </div>
                    <div>
                        <i className="fa fa-briefcase mr-2"/>
                        {designation}
                    </div>
                    <div>
                        <i className="fa fa-graduation-cap mr-2"/>
                        {education}
                    </div>
                </div>
                <div className="tw-mt-3 tw-border-t-2 tw-text-center">
                    <div className="tw-flex tw-flex-col tw-justify-center md:tw-mx-16">
                        <div className="nav-wrapper">
                            <ul id="tabs-icons-text" role="tablist"
                                className="nav-fill flex-column flex-md-row nav nav-pills">
                                <li className="nav-item">
                                    <a
                                        aria-selected="false"
                                        role="tab"
                                        className="mb-sm-3 mb-md-0 active nav-link"
                                        ref={skillsTab}
                                        onClick={() => activateTab(skillsTabContent, skillsTab)}
                                    >
                                        <i className="ni ni-atom mr-2"/>
                                        Skills
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        aria-selected="false"
                                        role="tab"
                                        className="mb-sm-3 mb-md-0 nav-link"
                                        ref={experienceTab}
                                        onClick={() => activateTab(experienceTabContent, experienceTab)}
                                    >
                                        <i className="ni ni-briefcase-24 mr-2"/>
                                        Experience
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        aria-selected="true"
                                        role="tab"
                                        className="mb-sm-3 mb-md-0 nav-link"
                                        ref={aboutTab}
                                        onClick={() => activateTab(aboutTabContent, aboutTab)}
                                    >
                                        <i className="ni ni-circle-08 mr-2"/>
                                        About
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content">
                            <div className="tab-pane active tw-my-4 md:tw-mx-24" ref={skillsTabContent}>
                                {
                                    skills.length && skills.map((skill) => (
                                        <Image
                                            height={85}
                                            width={100}
                                            key={skill.logo}
                                            className="tw-inline-block tw-m-4"
                                            src={skill.logo}
                                            alt={skill.name}
                                        />
                                    ))
                                }
                            </div>
                            <div className="tab-pane tw-my-4 md:tw-mx-24" ref={aboutTabContent}
                                 onClick={() => activateTab(aboutTabContent)}>
                                <p className="description" ref={aboutRef}>
                                    {about}
                                </p>
                            </div>
                            <div className="tab-pane tw-my-4 md:tw-mx-24" ref={experienceTabContent}
                                 onClick={() => activateTab(experienceTabContent)}>
                                <div>
                                    {experience.length && experience.map((company, index) => (
                                        <div className="tw-flex tw-justify-between tw-items-center tw-shadow-md tw-rounded-xl tw-p-4 tw-my-8" key={index}>
                                            <div>
                                                <Image height={60} width={100} src={company.logo}
                                                       alt="Company Logo"/>
                                            </div>
                                            <div className="tw-flex tw-flex-col tw-flex-1">
                                                <div>
                                                    <h4 className="tw-mb-0">
                                                        {company.designation}
                                                        {" "}
                                                        @
                                                        {" "}
                                                        {company.company}
                                                    </h4>
                                                    <p className="text-muted mb-0">
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
                                                <p className="my-2">
                                                    <i className="ni ni-pin-3 mr-2"/>
                                                    {" "}
                                                    {company.location}
                                                </p>
                                                <div>
                                                {company.technologies && company.technologies.map((technology) =>
                                                    <Badge key={technology} text={technology} className="tw-m-1"/>)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
