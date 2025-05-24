import Image from "next/image";
import Section from "../../components/tailwind/section";
import Profile from "../../components/profile/profile";
import Tabs, {TabData} from "../../components/tailwind/tabs";
import { Text, Title, Group, Timeline, ThemeIcon, Badge as MantineBadge, Box, SimpleGrid } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconCalendarEvent } from "@tabler/icons-react";

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
                <SimpleGrid
                    cols={{ base: 2, xs:3, sm: 4, md: 5, lg: 6 }}
                    spacing={{ base: "md", sm: "lg" }}
                    verticalSpacing={{ base: "md", sm: "lg" }}
                >
                    {skills.length > 0 && skills.map((skill) => (
                        <Box key={skill.name} className="text-center flex flex-col items-center">
                            <Image
                                height={50}
                                width={50}
                                className="mb-1"
                                src={skill.logo}
                                alt={skill.name}
                                style={{ objectFit: "contain" }}
                            />
                        </Box>
                    ))}
                </SimpleGrid>
            ),
        },
        {
            name: "Experience",
            content: (
                <div className="dark:text-white">
                    <Timeline active={experience.length} bulletSize={24} lineWidth={2} color="brandMutedYellow">
                        {experience.length && experience.map((company, index) => (
                            <Timeline.Item 
                                key={index} 
                                title={<span className="dark:text-white">{`${company.designation} @ ${company.company}`}</span>}
                                bullet={
                                    <ThemeIcon size={20} variant="filled" color="brandMutedYellow" radius="xl">
                                        <IconBriefcase size={12} />
                                    </ThemeIcon>
                                }
                            >
                                {company.logo && (
                                    <Image 
                                        height={30} 
                                        width={80} 
                                        src={company.logo} 
                                        alt={`${company.company} logo`} 
                                        style={{ marginTop: "8px", marginBottom: "8px" }} 
                                    />
                                )}
                                <Text c="dimmed" size="sm" className="dark:text-white">
                                    <IconCalendarEvent size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                    {company.from} - {company.to}
                                </Text>
                                <Text size="sm" mt={4} className="dark:text-white">
                                    <IconMapPin size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                    {company.location}
                                </Text>
                                <Group gap="xs" mt="sm">
                                    {company.technologies && company.technologies.map((technology) =>
                                        <MantineBadge key={technology} variant="light" color="brandMutedYellow">{technology}</MantineBadge>)}
                                </Group>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </div>
            ),
        },
        {
            name: "About",
            content: <div className="dark:text-white" dangerouslySetInnerHTML={{ __html: about }} />
        },
    ];

    return (
        <Section container id="about">
            <div className="shadow-2xl rounded px-4 py-8 dark:text-white">
                <div className="flex flex-col justify-between items-center lg:flex-row">
                    <div className="flex-1 mb-4 lg:mb-0 -mt-12 lg:order-2">
                        <Image
                            src={imageUrl}
                            className="rounded-full block mx-auto h-48 w-48 min-w-48 object-cover"
                            alt="dp"
                            sizes="100vw"
                            width={0}
                            height={0}
                        />
                    </div>
                    <div className="flex-1 lg:order-1">
                        <Group justify="center" className="flex">
                            {stats.length && stats.map((stat) => (
                                <div key={stat.label} className="mx-4 text-center">
                                    <Title order={3} className="dark:text-white">{stat.count}</Title> 
                                    <Text size="xs" className="text-neutralGray-700 dark:text-neutralGray-400">{stat.label}</Text> 
                                </div>
                            ))}
                        </Group>
                    </div>
                    <div className="flex-1 lg:order-3">
                        <Group justify="center" className="py-4 flex">
                            {profiles.length && profiles.map((profile) => (
                                <Profile url={profile.url} name={profile.name} key={profile.name}/>
                            ))}
                        </Group>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <Title order={2} className="mb-6 dark:text-white">{name}</Title>
                    
                    <Text fw={600} className="text-neutralGray-600 dark:text-neutralGray-300 mt-1">
                        <IconMapPin size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                        {location}
                    </Text>
                    <Text className="mt-1 dark:text-white">
                        <IconBriefcase size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                        {designation}
                    </Text>
                    <Text className="mt-1 dark:text-white">
                        <i className="fa fa-graduation-cap mr-2"/>
                        {education}
                    </Text>
                </div>
                <div className="mt-10 pt-8 border-t-2 text-center">
                    <div className="flex flex-col justify-center md:mx-8">
                        <Tabs tabs={tabsData} className="container"/>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;
