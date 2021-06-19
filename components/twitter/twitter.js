import PropTypes from 'prop-types'

const Twitter = ({ label }) => (
  <section className="mx-auto text-center">
    <h3 className="text-center my-4 display-3">{label}</h3>
    <a className="twitter-timeline" data-lang="en" data-width="600" data-height="300" data-dnt="true" data-theme="dark" href="https://twitter.com/soniprasheel?ref_src=twsrc%5Etfw">Tweets by soniprasheel</a>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8" />
  </section>
)

Twitter.propTypes = {
  label: PropTypes.string,
}

Twitter.defaultProps = {
  label: 'My Twitter Timeline',
}

export default Twitter;
