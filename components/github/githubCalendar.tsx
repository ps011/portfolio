import GitHubCalendar from "react-github-calendar";

const GithubCalendar = ({ username }: {username: string}) => {
    return (
        <div className="tw-text-center">
            <h3 className="tw-my-8 tw-text-2xl tw-font-weight-600 dark:tw-text-white">My GitHub Calendar</h3>
            <GitHubCalendar username={username} style={{"margin": "auto", colorScheme: "inherit"}} colorScheme="dark"/>
        </div>
    );
};

export default GithubCalendar;
