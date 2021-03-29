import PropTypes from 'prop-types'

const Card = ({
  _id, thumbnail, title, shortDescription, tags = [],
}) => {
  let tagsArray
  if (typeof tags === 'string') {
    tagsArray = tags.split(',');
  } else {
    tagsArray = tags
  }
  return (
    <div className="col-lg-4" style={{ display: 'inline-block' }}>
      <div className="card shadow border-0 my-2" data-aos-offset="300" data-aos="flip-right">
        <div className="card-body">
          { thumbnail
            ? (
              <div className="mb-4">
                <img src={thumbnail} className="img-fluid" alt={`Blog ${title} Description`} />
              </div>
            ) : (
              <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                <i className="ni ni-check-bold" />
              </div>
            )}
          <h6 className="text-primary text-uppercase">{title}</h6>
          <p className="description mt-3">{shortDescription}</p>
          <div>
            { tagsArray.length ? tagsArray.map((tag) => <span className="badge badge-pill badge-primary">{tag}</span>) : ''}
          </div>
          <a href={`/blog/${_id}`} className="btn btn-primary mt-4">Read more</a>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  _id: PropTypes.string,
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  tags: PropTypes.string,
}

Card.defaultProps = {
  _id: undefined,
  thumbnail: undefined,
  title: undefined,
  shortDescription: undefined,
  tags: undefined,
}

export default Card
