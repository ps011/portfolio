import { useRouter } from 'next/router'

const Blog = ({
  title, banner, profileLink, author, date,
}) => {
  const router = useRouter()
  const currentUrl = router.pathName
  const fbSharingUrl = `https://www.facebook.com/sharer.php?u=${currentUrl}`
  const twitterSharingUrl = `https://twitter.com/intent/tweet?&url=${currentUrl}`
  const linkedinSharingUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`
  return (
    <div className="content">
      <div className="row">
        <div className="col-sm-12">
          <article className="post">
            <div className="post-header">
              <img src={banner} alt="Post" className="img-fluid post-image" />
              <h1 className="post-title">{title}</h1>
            </div>
            <div className="container my-4">
              <span className="mx-4">
                <i className="fa fa-user mr-2" />
                <a href={profileLink}>{author}</a>
              </span>
              <span className="mx-4">
                <i className="fa fa-calendar mr-2" />
                <a href="#">{date}</a>
              </span>
            </div>

            <div className="post-body container">
              {/* <markdown [src]="blog?.content"></markdown> */}
            </div>

            <div className="share-icon clearfix container">
              <span>Share this Post:</span>
              <ul className="list-inline list-social">
                <li>
                  <a href={fbSharingUrl} rel="noreferrer" target="_blank" className="social-icon social-icon-colored social-icon-facebook">
                    <i className="fa fa-facebook" />
                  </a>
                </li>
                <li>
                  <a href={twitterSharingUrl} rel="noreferrer" target="_blank" className="social-icon social-icon-colored social-icon-twitter">
                    <i className="fa fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href={linkedinSharingUrl} rel="noreferrer" target="_blank" className="social-icon social-icon-colored social-icon-linkedin">
                    <i className="fa fa-linkedin" />
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default Blog
