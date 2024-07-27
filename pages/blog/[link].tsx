import { useRouter } from 'next/router'
import MarkdownRenderer from '../../components/markdown-renderer/markdown-renderer'
import s from './[link].module.scss'

export async function getStaticProps(context) {
  if (!context.params.link.startsWith('http')) {
    let data = await fetch(`${process.env.BASE_URL}/blogs/${context.params.link}`)
    data = await data.json()
    return { props: data }
  }
  return { props: {} };
}

export async function getStaticPaths() {
  const data = await fetch(`${process.env.BASE_URL}/blogs`)
  const posts = await data.json()
  return {
    paths: posts.map((post) => ({
      params: {
        link: post.link,
      },
    })),
    fallback: false,
  }
}

interface BlogProps {
    title: string;
    banner: string;
    profileLink: string;
    author: string;
    date: string;
    content: string;
}
const Blog = ({
  title, banner, profileLink, author, date, content,
}: BlogProps) => {
  const router = useRouter()
  const currentUrl = router.pathname
  const fbSharingUrl = `https://www.facebook.com/sharer.php?u=${currentUrl}`
  const twitterSharingUrl = `https://twitter.com/intent/tweet?&url=${currentUrl}`
  const linkedinSharingUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`
  return (
    <div className="content">
      <div className="row">
        <div className="col-sm-12">
          <article className="post">
            <div className={s.postHeader}>
              <img src={banner} alt="Post" className={`img-fluid ${s.postImage}`} />
              <h1 className={s.postTitle}>{title}</h1>
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
            <MarkdownRenderer content={content} />
            <div className="share-icon clearfix container">
              <span>Share this Post:</span>
              <ul className={`list-inline ${s.listSocial}`}>
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
