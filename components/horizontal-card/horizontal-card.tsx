interface HorizontalCardProps {
    title: string;
    description: string;
    type: 'dark' | 'light';

}
const HorizontalCard = ({
  title, description, type,
}: HorizontalCardProps) => (title || description) && (type === 'dark'
  ? (
    <div className="card shadow shadow-lg--hover my-2" data-aos="fade-right">
      <div className="card-body">
        <div className="d-flex px-3">
          <div className="pl-4">
            <h5 className="title text-primary font-weight-bold">{title}</h5>
            <p>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="d-flex px-3 mt-5" data-aos="fade-right">
      <div className="pl-4">
        <h4 className="display-3 text-white">{title}</h4>
        <p className="text-white">{description}</p>
      </div>
    </div>
  )
)

export default HorizontalCard
