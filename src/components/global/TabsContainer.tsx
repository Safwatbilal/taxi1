import React, { useEffect, useState } from "react";

type TabItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  content: React.ReactNode;
};

type TabsContainerProps = {
  title?: string;
  tabs: TabItem[];
  defaultTabId?: string;
};

const TabsContainer: React.FC<TabsContainerProps> = ({
  title,
  tabs,
  defaultTabId,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0].id);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      console.log({ width });
      if (width > 1300) {
        setColumns(tabs.length);
      } else if (width > 1200) {
        setColumns(Math.ceil(tabs.length / 2));
      } else if (width > 700) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tabs.length]);

  return (
    <div>
      {/* {title && (
        <h1 className="text-2xl font-bold text-primary mb-6">{title}</h1>
      )} */}
      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl border-2 transition-all duration-200 min-w-[200px] ${
                isActive
                  ? "border-primary/10 bg-blue-50 text-primary/70"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive
                    ? "bg-primary/5 text-primary/50"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="text-left">
                <div className="text-[15px] text-gray-500">{tab.label}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div>
        {tabs.map(
          (tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default TabsContainer;
