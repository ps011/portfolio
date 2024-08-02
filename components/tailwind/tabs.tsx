import {useState, ReactElement} from "react";

export interface TabData {
    name: string;
    content: ReactElement;
}

interface TabsProps {
    className?: string;
    tabs: TabData[];
}

const Tabs = ({tabs, className}: TabsProps) => {
    const [activeTab, setActiveTab] = useState(0);

    const onTabChange = (index: number) => {
        setActiveTab(index);
    };

    return (
        <div className={`${className ?? ""} tw-relative tw-right-0`}>
            <ul
                className="tw-relative tw-flex tw-flex-wrap tw-p-1 tw-list-none tw-rounded-xl"
                data-tabs="tabs"
                role="list"
            >
                {tabs.map((tab, index) => (
                    <li
                        key={index}
                        className={`tw-z-30 tw-flex-auto tw-text-center tw-p-2 tw-mx-2 tw-border-2 tw-border-neutral-100 tw-rounded-md ${activeTab === index ? "tw-bg-primary-100 tw-text-white" : "tw-bg-neutral-100"}`}
                        onClick={() => onTabChange(index)}
                        data-tab-index={index}
                    >
                        <button
                            className="tw-z-30 tw-flex tw-items-center tw-justify-center tw-w-full tw-px-0 tw-py-1 tw-mb-0 tw-transition-all tw-ease-in-out tw-border-0 tw-rounded-lg tw-cursor-pointer"
                            role="tab"
                            aria-controls={tab.name.toLowerCase()}
                        >
                            <span className="tw-ml-1">{tab.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
            <div data-tab-content="" className="tw-p-5">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        data-tab-content-index={index}
                        className={`${activeTab === index ? "tw-block" : "tw-hidden"}`}
                        id={tab.name.toLowerCase()}
                        role="tabpanel"
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
