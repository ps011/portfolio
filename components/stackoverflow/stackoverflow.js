import PropTypes from 'prop-types'

export default function Stackoverflow({ name, id, url, label }) {
  return (
    <div className="mx-auto text-center">
      <h3 className="text-center my-4 display-3">{label}</h3>
      <a href={url} rel="noreferrer" target="_blank">
        <img src={`https://stackoverflow.com/users/flair/${id}.png`} width="208" height="58" alt={`profile for ${name} at Stack Overflow, Q&amp;A for professional and enthusiast programmers`} title={`profile for ${name} at Stack Overflow, Q&amp;A for professional and enthusiast programmers`} />
      </a>
    </div>
  )
}

Stackoverflow.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  label: PropTypes.string,
}

Stackoverflow.defaultProps = {
  label: 'My Stackoverflow Stats',
}
