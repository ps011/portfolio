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
        <div className={`${className ?? ""} relative right-0`}>
            <ul
                className="relative flex flex-wrap p-1 list-none rounded-xl"
                data-tabs="tabs"
                role="list"
            >
                {tabs.map((tab, index) => (
                    <li
                        key={index}
                        className={`z-30 flex-auto text-center p-2 m-1 rounded-md cursor-pointer transition-colors duration-150 ease-in-out ${ 
                            activeTab === index 
                                ? "bg-brandMutedYellow-500 text-white shadow-md dark:bg-brandMutedYellow-600 dark:text-white" 
                                : "bg-neutralGray-200 text-neutralGray-700 hover:bg-neutralGray-100 dark:bg-neutralGray-700 dark:text-neutralGray-300 dark:hover:bg-neutralGray-600"
                        }`}
                        onClick={() => onTabChange(index)}
                        data-tab-index={index}
                    >
                        <span className="ml-1 font-bold">{tab.name}</span>
                    </li>
                ))}
            </ul>
            <div data-tab-content="" className="p-5">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        data-tab-content-index={index}
                        className={`${activeTab === index ? "block" : "hidden"}`}
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
