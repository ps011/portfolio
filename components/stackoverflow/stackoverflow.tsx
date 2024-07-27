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
        <div className="tw-flex tw-flex-col tw-items-center">
            <h3 className="tw-my-8 tw-text-2xl tw-font-weight-600">{label}</h3>

            <a href={url} rel="noreferrer" target="_blank" className="tw-inline-block">
                <Image src={`https://stackoverflow.com/users/flair/${id}.png`} width="208" height="58"
                       alt={`profile for ${name} at Stack Overflow, Q&amp;A for professional and enthusiast programmers`}
                       title={`profile for ${name} at Stack Overflow, Q&amp;A for professional and enthusiast programmers`}/>
            </a>

        </div>
    );
}
