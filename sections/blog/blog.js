import PropTypes from 'prop-types'
import Card from '../../components/card/card'

const Blog = ({ blogs }) => (
  <section className="section section-lg pt-lg-0 mt-5" id="blog-posts">
    <div className="container">
      <h3 className="text-center mb-4 display-3">Blog Posts</h3>
      <div className="">
        { blogs.length && blogs.map((blog) => <Card {...blog} />)}
      </div>
    </div>
  </section>
)

Blog.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Blog
