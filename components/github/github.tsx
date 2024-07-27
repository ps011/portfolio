import GitHubCalendar from "react-github-calendar";

const Github = ({ username }: {username: string}) => {
    return (
        <div className="text-center container">
            <h3 className="text-center my-4 display-3">My GitHub Calendar</h3>
            <GitHubCalendar username={username} style={{"margin": "auto"}} colorScheme="light"/>
        </div>
    );
};

export default Github;
