import PropTypes from 'prop-types'
import Card from '../../components/card/card'

const Blog = ({ blogs }) => {
  // eslint-disable-next-line
  const groupBy = (xs, f) => xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {})
  const result = groupBy(blogs, (c) => c.type);
  return (
    <section className="section section-lg pt-lg-0 mt-5" id="blog-posts">
      <div className="container">
        { Object.keys(result).length && Object.keys(result).map((sectionName, index) => [<h3 key={`heading-${index}`} className="text-center mb-4 display-3">{sectionName.split('-').map((word) => word[0].toUpperCase() + word.substring(1)).join(' ')}</h3>,
          <div>
            { result[sectionName].length && result[sectionName].map((blog) => {
              if (!blog.hidden) return <Card key={blog.url} {...blog} />
              return ''
            })}
          </div>])}
      </div>
    </section>
  )
}

Blog.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Blog
