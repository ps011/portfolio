import PropTypes from 'prop-types'

const Card = ({
  id, thumbnail, title, shortDescription,
}) => (
  <div className="col-lg-4">
    <div className="card shadow border-0 my-2" data-aos-offset="300" data-aos="flip-right">
      <div className="card-body">
        <div className="mb-4">
          <img src={thumbnail} className="img-fluid" alt={`Blog ${title} Description`} />
        </div>
        <h6 className="text-primary text-uppercase">{title}</h6>
        <p className="description mt-3">{shortDescription}</p>
        <a href={`/blog/${id}`} className="btn btn-primary mt-4">Read more</a>
      </div>
    </div>
  </div>
)

Card.propTypes = {
  id: PropTypes.string,
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  shortDescription: PropTypes.string,
}

Card.defaultProps = {
  id: undefined,
  thumbnail: undefined,
  title: undefined,
  shortDescription: undefined,
}

export default Card
