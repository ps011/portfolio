import { Text, Title } from "@mantine/core";

interface HorizontalCardProps {
    title: string;
    description: string;
}

const HorizontalCard = ({
                            title, description,
                        }: HorizontalCardProps) => (
    <div className="bg-white shadow-md my-2 rounded-xl dark:bg-neutralGray-800 dark:text-white" data-aos="fade-right">
        <div className="flex p-8">
            <div className="pl-4">
                <Title order={5} className="text-brandMutedYellow-700 dark:text-brandMutedYellow-200 mb-4">{title}</Title>
                <Text className="dark:text-white"> 
                    {description}
                </Text>
            </div>
        </div>
    </div>
);

export default HorizontalCard;
