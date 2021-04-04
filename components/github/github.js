import GitHubCalendar from 'react-github-calendar'
import PropTypes from 'prop-types'

const Github = ({ username }) => (
  <div className="text-center container">
    <h3 className="text-center my-4 display-3">My GitHub Calendar</h3>
    <GitHubCalendar username={username} />
  </div>
)

Github.propTypes = {
  username: PropTypes.string.isRequired,
}

export default Github
