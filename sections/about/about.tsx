import Image from "next/image";
import Section from "../../components/tailwind/section";
import Profile from "../../components/profile/profile";
import { Text, Title, Group, Timeline, ThemeIcon, Badge as MantineBadge, Box, SimpleGrid, Card, Stack } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconCalendarEvent, IconCode, IconUser, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";

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

    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const toggleCard = (cardType: string) => {
        const newExpandedCard = expandedCard === cardType ? null : cardType;
        setExpandedCard(newExpandedCard);
        
        // Scroll to the about section when expanding a card
        if (newExpandedCard) {
            setTimeout(() => {
                const aboutSection = document.getElementById("about");
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100); // Small delay to allow the layout to update
        }
    };

    const AboutPreview = () => (
        <div className="dark:text-white">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ 
                __html: about?.length > 200 ? about.substring(0, 200) + "..." : about, 
            }} />
            <Text size="sm" c="dimmed" className="mt-2">
                Click to read more
            </Text>
        </div>
    );

    const AboutExpanded = () => (
        <div className="dark:text-white">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: about }} />
        </div>
    );

    const ExperiencePreview = () => (
        <div className="dark:text-white">
            <Stack gap="sm">
                {experience.slice(0, 2).map((company, index) => (
                    <Card key={index} padding="sm" className="bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            {company.logo && (
                            <Image
                                    height={24} 
                                    width={60} 
                                    src={company.logo} 
                                    alt={`${company.company} logo`} 
                                style={{ objectFit: "contain" }}
                            />
                            )}
                            <div className="flex-1">
                                <Text fw={600} size="sm" className="dark:text-white">
                                    {company.designation}
                                </Text>
                                <Text size="xs" c="dimmed" className="dark:text-neutralGray-400">
                                    {company.company} • {company.from} - {company.to}
                                </Text>
                            </div>
                        </div>
                    </Card>
                ))}
            </Stack>
            {experience.length > 2 && (
                <Text size="sm" c="dimmed" className="mt-2">
                    +{experience.length - 2} more positions. Click to see all
                </Text>
            )}
        </div>
    );

    const ExperienceExpanded = () => (
                <div className="dark:text-white">
                    <Timeline active={experience.length} bulletSize={24} lineWidth={2} color="brandMutedYellow">
                {experience.map((company, index) => (
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
    );

    const SkillsPreview = () => (
        <div className="dark:text-white">
            <SimpleGrid
                cols={{ base: 2, xs: 4, sm: 4, md: 4 }}
                spacing="sm"
            >
                {skills.slice(0, 8).map((skill) => (
                    <Box key={skill.name} className="text-center flex flex-col items-center">
                        <Image
                            height={64}
                            width={64}
                            className="mb-1"
                            src={skill.logo}
                            alt={skill.name}
                            style={{ objectFit: "contain" }}
                        />
                        <Text size="xs" className="text-neutralGray-600 dark:text-neutralGray-400">
                            {skill.name}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
            {skills.length > 8 && (
                <Text size="sm" c="dimmed" className="mt-4 text-center">
                    +{skills.length - 8} more skills. Click to see all
                </Text>
            )}
        </div>
    );

    const SkillsExpanded = () => (
        <div className="dark:text-white">
            <SimpleGrid
                cols={{ base: 3, xs: 4, sm: 6, md: 8, lg: 10 }}
                spacing={{ base: "md", sm: "lg" }}
                verticalSpacing={{ base: "md", sm: "lg" }}
            >
                {skills.map((skill) => (
                    <Box key={skill.name} className="text-center flex flex-col items-center">
                        <Image
                            height={50}
                            width={50}
                            className="mb-2 hover:scale-110 transition-transform duration-200"
                            src={skill.logo}
                            alt={skill.name}
                            style={{ objectFit: "contain" }}
                        />
                        <Text size="xs" className="text-neutralGray-600 dark:text-neutralGray-400 text-center">
                            {skill.name}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
        </div>
    );

    return (
        <Section container id="about">
            <div className="shadow-2xl rounded px-4 py-8 dark:text-white">
                {/* Profile Header Section */}
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

                {/* Name and Basic Info */}
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

                {/* Expandable Cards Section */}
                <div className="mt-12">
                    <div className="space-y-6">
                        {/* Expanded Card - Full Width */}
                        <div className={`transition-all duration-500 ease-in-out overflow-scroll ${
                            expandedCard ? "max-h-screen opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"
                        }`}>
                            {expandedCard === "about" && (
                                <Card 
                                    padding="lg" 
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg ring-2 ring-blue-500 dark:ring-blue-400 transform hover:scale-[1.02]"
                                    onClick={() => toggleCard("about")}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <IconUser size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                                            <Title order={4} className="dark:text-white">About Me</Title>
                                        </div>
                                        <IconChevronUp size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="transition-all duration-500 ease-in-out">
                                        <AboutExpanded />
                                    </div>
                                </Card>
                            )}
                            
                            {expandedCard === "experience" && (
                                <Card 
                                    padding="lg" 
                                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg ring-2 ring-green-500 dark:ring-green-400 transform hover:scale-[1.02]"
                                    onClick={() => toggleCard("experience")}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <IconBriefcase size={20} className="mr-2 text-green-600 dark:text-green-400" />
                                            <Title order={4} className="dark:text-white">Experience</Title>
                                        </div>
                                        <IconChevronUp size={20} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="transition-all duration-500 ease-in-out">
                                        <ExperienceExpanded />
                                    </div>
                                </Card>
                            )}
                            
                            {expandedCard === "skills" && (
                                <Card 
                                    padding="lg" 
                                    className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg ring-2 ring-purple-500 dark:ring-purple-400 transform hover:scale-[1.02]"
                                    onClick={() => toggleCard("skills")}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <IconCode size={20} className="mr-2 text-purple-600 dark:text-purple-400" />
                                            <Title order={4} className="dark:text-white">Skills</Title>
                                        </div>
                                        <IconChevronUp size={20} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="transition-all duration-500 ease-in-out">
                                        <SkillsExpanded />
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Collapsed Cards - Side by Side */}
                        <div className={`grid gap-4 transition-all duration-500 ease-in-out ${
                            expandedCard ? "mt-6 grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
                        }`}>
                            {/* About Card */}
                            {expandedCard !== "about" && (
                            <div className={`transition-all duration-500 ease-in-out transform ${
                                expandedCard === "about" ? "opacity-0 scale-95 -translate-y-4" : "opacity-100 scale-100 translate-y-0"
                            }`}>
                                    <Card 
                                        padding="lg" 
                                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 h-80 flex flex-col"
                                        onClick={() => toggleCard("about")}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <IconUser size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                <Title order={4} className="dark:text-white">About Me</Title>
                                            </div>
                                            <IconChevronDown size={20} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="transition-all duration-300 ease-in-out flex-1 flex flex-col justify-between">
                                            <AboutPreview />
                                        </div>
                                    </Card>
                            </div>
                                )}

                            {/* Experience Card */}
                            {expandedCard !== "experience" && (
                            <div className={`transition-all duration-500 ease-in-out transform ${
                                expandedCard === "experience" ? "opacity-0 scale-95 -translate-y-4" : "opacity-100 scale-100 translate-y-0"
                            }`}>
                                    <Card 
                                        padding="lg" 
                                        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 h-80 flex flex-col"
                                        onClick={() => toggleCard("experience")}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <IconBriefcase size={20} className="mr-2 text-green-600 dark:text-green-400" />
                                                <Title order={4} className="dark:text-white">Experience</Title>
                                            </div>
                                            <IconChevronDown size={20} className="text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="transition-all duration-300 ease-in-out flex-1 flex flex-col justify-between">
                                            <ExperiencePreview />
                                        </div>
                                    </Card>
                            </div>
                                )}

                            {/* Skills Card */}
                            {expandedCard !== "skills" && (
                            <div className={`transition-all duration-500 ease-in-out transform ${
                                expandedCard === "skills" ? "opacity-0 scale-95 -translate-y-4" : "opacity-100 scale-100 translate-y-0"
                            }`}>
                                    <Card 
                                        padding="lg" 
                                        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 h-80 flex flex-col"
                                        onClick={() => toggleCard("skills")}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <IconCode size={20} className="mr-2 text-purple-600 dark:text-purple-400" />
                                                <Title order={4} className="dark:text-white">Skills</Title>
                                            </div>
                                            <IconChevronDown size={20} className="text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="transition-all duration-300 ease-in-out flex-1 flex flex-col justify-between">
                                            <SkillsPreview />
                                        </div>
                                    </Card>
                            </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;
