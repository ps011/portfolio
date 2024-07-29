import Slider, {Settings} from "react-slick";
import Card from "../../components/card/card";

const Blog = ({blogs}: { blogs: any[] }) => {
    const settings: Settings = { // TODO: have types here
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 2560,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                },
            }],
    };
    const groupBy = (xs, f) => xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    const kebabCaseToSentenceCase = (str) => str.split("-").map((word) => word[0].toUpperCase() + word.substring(1)).join(" ");
    const result = groupBy(blogs, (c) => c.type);
    return (
        <section className="tw-mt-5 tw-container" id="blog-posts">
                {Object.keys(result).length && Object.keys(result).map((sectionName) => (
                    <div className="tw-mt-8" key={sectionName}>
                        <h3 className="tw-text-center tw-mb-4">
                            {kebabCaseToSentenceCase(sectionName)}
                        </h3>
                        <Slider {...settings}>
                            {result[sectionName].length && result[sectionName].map((blog, index) => {
                                return blog.hidden ? null : <Card key={index} {...blog} />;
                            })}
                        </Slider>
                    </div>
                ))}
        </section>
    );
};

export default Blog;
