import { Text, Title } from "@mantine/core";

interface HorizontalCardProps {
    title: string;
    description: string;
}

const HorizontalCard = ({
                            title, description,
                        }: HorizontalCardProps) => (
    <div className="shadow-md my-2 rounded-xl dark:text-white" style={{ backgroundColor: 'var(--theme-tertiary-50)' }} data-aos="fade-right">
        <div className="flex p-8">
            <div className="pl-4">
                <Title order={5} className="mb-4" style={{ color: 'var(--theme-primary-700)' }}>{title}</Title>
                <Text className="dark:text-white"> 
                    {description}
                </Text>
            </div>
        </div>
    </div>
);

export default HorizontalCard;
