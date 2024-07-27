import GitHubCalendar from "react-github-calendar";

const Github = ({ username }: {username: string}) => {
    return (
        <div className="tw-text-center">
            <h3 className="tw-my-8 tw-text-2xl tw-font-weight-600">My GitHub Calendar</h3>
            <GitHubCalendar username={username} style={{"margin": "auto"}} colorScheme="light"/>
        </div>
    );
};

export default Github;
