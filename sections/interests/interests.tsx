import Image from "next/image";
import Section from "../../components/tailwind/section";
import Link from "next/link";

interface InterestsProps {
    illustration: string;
    interests: {
        title: string;
        description: string;
    }[];
}

const Interests = ({ illustration, interests }: InterestsProps) => {

    const getInterestType = (title: string): "blogging" | "photography" | "coding" | "other" => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("blog") || lowerTitle.includes("writing")) {
            return "blogging";
        }
        if (lowerTitle.includes("photo") || lowerTitle.includes("camera") || lowerTitle.includes("image")) {
            return "photography";
        }
        if (lowerTitle.includes("coding") || lowerTitle.includes("programming") || lowerTitle.includes("development")) {
            return "coding";
        }
        return "other";
    };


    const getCTAButton = (interest: { title: string; description: string }) => {
        const type = getInterestType(interest.title);
        switch (type) {
            case "blogging":
                return (
                    <Link 
                        href="/blog" 
                        className="inline-block text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium w-full text-center"
                        style={{ backgroundColor: 'var(--theme-primary-500)' }}
                    >
                        📝 View My Blog Posts
                    </Link>
                );
            case "photography":
                return (
                    <Link 
                        href="/photo-gallery" 
                        className="inline-block text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium w-full text-center"
                        style={{ backgroundColor: 'var(--theme-primary-500)' }}
                    >
                        📸 Explore Photo Gallery
                    </Link>
                );
            case "coding":
                return (
                    <Link 
                        href="https://github.com/ps011" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium w-full text-center"
                        style={{ backgroundColor: 'var(--theme-primary-500)' }}
                    >
                        💻 View My GitHub
                    </Link>
                );
            default:
                return (
                    <button 
                        className="inline-block text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium w-full text-center cursor-not-allowed opacity-60"
                        style={{ backgroundColor: 'var(--theme-tertiary-500)' }}
                        disabled
                    >
                        🔗 Coming Soon
                    </button>
                );
        }
    };

    return (
        <Section background="primary" id="interests">
            <div className="flex flex-col-reverse justify-around items-center md:flex-row container">
                <div className="flex-1">
                    {interests.length && interests.map((interest) => (
                        <div key={interest.title} className="mb-4">
                            <div 
                                className="shadow-md rounded-xl dark:text-white transition-all duration-300 hover:shadow-lg"
                                style={{ backgroundColor: 'var(--theme-tertiary-50)' }}
                                data-aos="fade-right"
                            >
                                <div className="flex p-8">
                                    <div className="pl-4 flex-1">
                                        <h3 className="mb-4 text-xl font-semibold" style={{ color: 'var(--theme-primary-700)' }}>
                                            {interest.title}
                                        </h3>
                                        <p className="dark:text-white mb-6">
                                            {interest.description}
                                        </p>
                                        
                                        {/* CTA Button */}
                                        <div className="mt-4">
                                            {getCTAButton(interest)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-1 pb-4 md:pb-0">
                    <Image height={0} width={0} src={illustration} alt="Interests" className="w-full h-full" />
                </div>
            </div>
        </Section>
    );
};

export default Interests;
