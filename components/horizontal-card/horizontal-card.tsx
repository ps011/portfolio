interface HorizontalCardProps {
    title: string;
    description: string;

}

const HorizontalCard = ({
                            title, description,
                        }: HorizontalCardProps) => (
    <div className="tw-bg-white tw-shadow-md tw-my-2 tw-rounded-xl" data-aos="fade-right">
        <div className="tw-flex tw-p-8">
            <div className="tw-pl-4">
                <h5 className="tw-text-xl tw-text-primary-100 tw-font-bold tw-mb-4">{title}</h5>
                <p>
                    {description}
                </p>
            </div>
        </div>
    </div>
);

export default HorizontalCard;
