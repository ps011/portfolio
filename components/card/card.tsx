import Link from "next/link";
import Image from "next/image";

interface CardProps {
  thumbnail: string;
  title: string;
  shortDescription: string;
  tags: string;
  link: string;
}
const Card = ({
  thumbnail, title, shortDescription, tags, link,
}: CardProps) => {
  let tagsArray = [];
  if (tags) {
    if (typeof tags === "string") {
      tagsArray = tags.split(",");
    } else {
      tagsArray = tags;
    }
  }

  const getLink = (link: string) => {
    if (link.startsWith("http")) {
      return link;
    } else {
      return `/blog/${link}`;
    }
  };

  return (
    <div style={{ display: "inline-block", padding: "8px" }}>
      <div className="card shadow border-0 my-2" data-aos="flip-right">
        <div className="card-body">
          {thumbnail
            ? (
              <div className="mb-4">
                <Image
                    src={thumbnail}
                    alt={`Blog ${title} Description`}
                    width={0}
                    height={0}
                    sizes="40vw"
                    style={{ width: "100%", height: "350px" }}
                />
              </div>
            ) : (
              <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                <i className="ni ni-check-bold" />
              </div>
            )}
          <h6 className="text-primary text-uppercase">{title}</h6>
          <p className="description mt-3">{shortDescription}</p>
          <div>
            {
              tagsArray.length ?
                  tagsArray.map(
                  (tag) => <span key={tag} className="badge badge-pill badge-primary">{tag}</span>
              )
                  : ""}
          </div>
          <Link href={getLink(link)} className="btn btn-primary mt-4" target="_blank">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
