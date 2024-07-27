import GitHubCalendar from "react-github-calendar";

const Github = ({ username }: {username: string}) => {
    return (
        <div className="text-center">
            <h3 className="my-4 text-2xl font-weight-600">My GitHub Calendar</h3>
            <GitHubCalendar username={username} style={{"margin": "auto"}} colorScheme="light"/>
        </div>
    );
};

export default Github;
