import Slider from 'react-slick';
import Card from '../../components/card/card'

const Blog = ({ blogs }: {blogs: any[]}) => {
  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: 'slides',
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      }],
  };
  // eslint-disable-next-line
  const groupBy = (xs, f) => xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {})
  const kebabCaseToSentenceCase = (str) => str.split('-').map((word) => word[0].toUpperCase() + word.substring(1)).join(' ')
  const result = groupBy(blogs, (c) => c.type);
  return (
    <section className="section section-lg pt-lg-0 mt-5" id="blog-posts">
      <div className="container">
        {Object.keys(result).length && Object.keys(result).map((sectionName) => (
          <div style={{ marginTop: '32px' }} key={sectionName}>
            <h3 className="text-center mb-4 display-3">
              {kebabCaseToSentenceCase(sectionName)}
            </h3>
            <Slider {...settings}>
              {result[sectionName].length && result[sectionName].map((blog, index) => {
                if (!blog.hidden) return <Card key={index} {...blog} />
                return null
              })}
            </Slider>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Blog
