import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";
import Card from "../../components/card/card";
import Section from "../../components/tailwind/section";
import { Blog as BlogType } from "../../interfaces/blog";

const Blog = ({blogs}: { blogs: BlogType[] }) => {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const isSmallScreen = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`); // Technikally, sm and up
    const isMediumScreen = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
    const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);
    const isXLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);

    const sortedBlogs = blogs
        .filter(blog => !blog.hidden)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // eslint-disable-next-line no-unused-vars
    const groupBy = (xs: BlogType[], f: (blog: BlogType) => string) => 
        xs.reduce((r, v) => {
            const k = f(v);
            (r[k] || (r[k] = [])).push(v);
            return r;
        }, {} as Record<string, BlogType[]>);

    const kebabCaseToSentenceCase = (str: string) => 
        str.split("-").map((word) => word[0].toUpperCase() + word.substring(1)).join(" ");

    const result = groupBy(sortedBlogs, (c) => c.type);

    let slidesToScrollValue = 1;
    let visibleSlides = 1;

    if (isXLargeScreen) {
        slidesToScrollValue = 5;
        visibleSlides = 5;
    } else if (isLargeScreen) {
        slidesToScrollValue = 4;
        visibleSlides = 4;
    } else if (isMediumScreen) {
        slidesToScrollValue = 3; 
        visibleSlides = 3;
    } else if (isSmallScreen) { // This is sm (since mobile is sm and down, and md,lg,xl are covered)
        slidesToScrollValue = 2;
        visibleSlides = 2;
    }
    // For mobile (base screen size), slidesToScrollValue and visibleSlides remain 1

    return (
        <>
            {Object.keys(result).length > 0 && Object.keys(result).map((sectionName) => {
                const slidesInSection = result[sectionName]?.length || 0;
                const showIndicators = mobile && slidesInSection > 1;
                const showControls = !mobile && slidesInSection > visibleSlides;

                return (
                    <Section container={true} key={sectionName} id="blog-posts" heading={kebabCaseToSentenceCase(sectionName)}>
                        <Carousel
                            slideSize={{
                                base: "100%", 
                                xs: "50%",
                                sm: "50%",   
                                md: "33.333333%", 
                                lg: "25%",    
                                xl: "20%",
                            }}
                            slideGap={{ base: 0, sm: "md" }}
                            emblaOptions={{ 
                                loop: true, 
                                align: "center",
                                slidesToScroll: slidesToScrollValue,
                            }}
                            withIndicators={showIndicators} 
                            withControls={showControls}
                        >
                            {result[sectionName]?.length > 0 && result[sectionName].map((blog, index) => {
                                return (
                                    <Carousel.Slide key={index}>
                                        <Card {...blog} tags={Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags} />
                                    </Carousel.Slide>
                                );
                            })}
                        </Carousel>
                    </Section>
                );
            })}
        </>
    );
};

export default Blog;
