import Image from "next/image";

interface StackoverflowProps {
    name: string;
    id: string;
    url: string;
    label?: string;

}

export default function Stackoverflow({
                                          name, id, url, label,
                                      }: StackoverflowProps) {
    return (
        <div className="mx-auto text-center">
            <h3 className="text-center my-4 display-3">{label}</h3>
            <a href={url} rel="noreferrer" target="_blank">
                <Image src={`https://stackoverflow.com/users/flair/${id}.png`} width="208" height="58"
                       alt={`profile for ${name} at Stack Overflow, Q&amp;A for professional and enthusiast programmers`}
                       title={`profile for ${name} at Stack Overflow, Q&amp;A for professional and enthusiast programmers`}/>
            </a>
        </div>
    );
}
