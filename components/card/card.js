import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

const Card = ({
  _id, thumbnail, title, shortDescription, tags = [], link,
}) => {
  let tagsArray
  if (typeof tags === 'string') {
    tagsArray = tags.split(',');
  } else {
    tagsArray = tags
  }
  return (
    <div style={{ display: 'inline-block', padding: '8px' }}>
      <div className="card shadow border-0 my-2" data-aos-offset="300" data-aos="flip-right">
        <div className="card-body">
          { thumbnail
            ? (
              <div className="mb-4">
                <Image src={thumbnail} className="img-fluid" alt={`Blog ${title} Description`} layout="responsive" width="100%" height="100%" />
              </div>
            ) : (
              <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                <i className="ni ni-check-bold" />
              </div>
            )}
          <h6 className="text-primary text-uppercase">{title}</h6>
          <p className="description mt-3">{shortDescription}</p>
          <div>
            { tagsArray.length ? tagsArray.map((tag) => <span key={tag} className="badge badge-pill badge-primary">{tag}</span>) : ''}
          </div>
          <Link href={link || `/blog/${_id}`}>
            <a className="btn btn-primary mt-4">Read more</a>
          </Link>
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
  link: PropTypes.string,
}

Card.defaultProps = {
  _id: undefined,
  thumbnail: undefined,
  title: undefined,
  shortDescription: undefined,
  tags: undefined,
  link: undefined,
}

export default Card
