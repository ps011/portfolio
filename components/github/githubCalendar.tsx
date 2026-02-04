import { GitHubCalendar } from "react-github-calendar";

const GithubCalendar = ({ username }: {username: string}) => {
    return (
        <div className="text-center">
            <h3 className="my-8 text-2xl font-weight-600 dark:text-white">My GitHub Calendar</h3>
            <GitHubCalendar username={username} style={{"margin": "auto", colorScheme: "inherit"}} colorScheme="dark"/>
        </div>
    );
};

export default GithubCalendar;
