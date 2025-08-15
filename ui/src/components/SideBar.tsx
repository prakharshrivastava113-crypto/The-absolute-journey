import { cn } from "@/lib/utils";
import axios from "axios";
import clsx from "clsx";
import { ArrowLeft, ChevronDown, ChevronRight, Phone, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export interface MenuItem {
  id: string;
  name: string;
  hasDropdown?: boolean;
  hasSubmenu?: boolean;
  weblink?: string;
  submenu?: MenuItem[];
}

interface SidebarState {
  isOpen: boolean;
  activeDropdown: number | null;
  selectedFirst: number | null;
  selectedSecond: number | null;
  selectedThird: number | null;
  secondActiveDropdown: number | null;
  isMobile: boolean;
  activePanels: string[];
}

const LinkComponent: React.FC<{
  weblink: string;
  name: string;
  uppercase: boolean;
}> = ({ weblink, name, uppercase }) => {
  return (
    <a
      href={weblink}
      className="flex items-center justify-between px-6 py-4 hover:text-blue-600 cursor-pointer text-gray-800 "
    >
      <span
        className={cn(
          "text-sm font-medium tracking-wide",
          uppercase && "uppercase"
        )}
      >
        {name}
      </span>
    </a>
  );
};

const MultiLevelSidebar: React.FC = () => {
  const [sidebarData, setSidebarData] = useState<MenuItem[] | null>(null);
  const [state, setState] = useState<SidebarState>({
    isOpen: false,
    activeDropdown: null,
    selectedFirst: null,
    selectedSecond: null,
    selectedThird: null,
    secondActiveDropdown: null,
    isMobile: false,
    activePanels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://webflow-3aa1.onrender.com/data"
        );
        setSidebarData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setState((prev) => ({ ...prev, isMobile: window.innerWidth < 768 }));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const resetState = () => {
    setState({
      isOpen: false,
      activeDropdown: null,
      selectedFirst: null,
      selectedSecond: null,
      selectedThird: null,
      secondActiveDropdown: null,
      isMobile: state.isMobile,
      activePanels: [],
    });
  };

  const toggleSidebar = () => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleDropdown = (itemId: number) => {
    setState((prev) => ({
      ...prev,
      activeDropdown: prev.activeDropdown === itemId ? null : itemId,
      selectedFirst: null,
      selectedSecond: null,
      selectedThird: null,
      secondActiveDropdown: null,
      activePanels: [],
    }));
  };

  const handleSubmenuClick = (
    hasSubmenu: boolean,
    parentIndex: number,
    childIndex: number
  ) => {
    if (hasSubmenu) {
      setState((prev) => ({
        ...prev,
        activeDropdown: parentIndex,
        selectedFirst: childIndex,
        selectedSecond: null,
        selectedThird: null,
        secondActiveDropdown: null,
        activePanels: ["destinations"],
      }));
    }
  };

  const handleSecondClick = (index: number) => {
    setState((prev) => ({
      ...prev,
      selectedSecond: index,
      secondActiveDropdown: prev.secondActiveDropdown === index ? null : index,
      selectedThird: null,
      activePanels: ["destinations", "region"],
    }));
  };

  const handleStateClick = (regionIndex: number, itemIndex: number) => {
    setState((prev) => ({
      ...prev,
      selectedSecond: regionIndex,
      selectedThird: itemIndex,
      activePanels: ["destinations", "region", "city"],
    }));
  };

  const goBack = () => {
    if (state.activePanels.includes("city")) {
      setState((prev) => ({
        ...prev,
        selectedThird: null,
        secondActiveDropdown: prev.selectedSecond,
        activePanels: ["destinations", "region"],
      }));
    } else if (state.activePanels.includes("region")) {
      setState((prev) => ({
        ...prev,
        selectedSecond: null,
        secondActiveDropdown: null,
        activePanels: ["destinations"],
      }));
    } else if (state.activePanels.includes("destinations")) {
      setState((prev) => ({
        ...prev,
        selectedFirst: null,
        activeDropdown: prev.activeDropdown,
        activePanels: [],
      }));
    }
  };

  const renderMainSidebar = () => (
    <div
      className={`bg-gray-100 h-full flex flex-col border-r border-gray-200 ${
        state.isMobile ? "w-full" : "w-80"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="w-6"></div>
        <button onClick={resetState} className="p-1 rounded ">
          <X size={24} className="text-gray-600 hover:text-blue-600" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="py-4">
          {sidebarData.map((item: MenuItem, index) => (
            <div key={index} className="border-b border-gray-200">
              {item.weblink ? (
                <LinkComponent
                  weblink={item.weblink}
                  name={item.name}
                  uppercase={false}
                />
              ) : (
                <div
                  className="flex items-center justify-between px-6 py-4 hover:text-blue-600 cursor-pointer text-gray-800"
                  onClick={() => item.hasDropdown && toggleDropdown(index)}
                >
                  <span className="text-sm font-medium uppercase tracking-wide">
                    {item.name}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform hover:text-blue-600 cursor-pointer ${
                        state.activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              )}
              {item.hasDropdown &&
                state.activeDropdown === index &&
                item.submenu && (
                  <div className="bg-gray-100 border-t border-gray-200">
                    {item.submenu.map((submenuItem: MenuItem, childIndex) =>
                      submenuItem.weblink && !submenuItem.hasSubmenu ? (
                        <a
                          key={submenuItem.id}
                          href={submenuItem.weblink}
                          className="text-sm font-medium  tracking-wide text-gray-800
                          flex items-center justify-between px-8 py-3 hover:text-blue-600 cursor-pointer border-b border-gray-200 last:border-b-0"
                          onClick={() =>
                            handleSubmenuClick(
                              !!submenuItem.hasSubmenu,
                              index,
                              childIndex
                            )
                          }
                        >
                          {submenuItem.name}
                        </a>
                      ) : (
                        <div
                          key={submenuItem.id}
                          className="flex items-center justify-between px-8 py-3 hover:text-blue-600 cursor-pointer border-b border-gray-200 last:border-b-0"
                          onClick={() =>
                            handleSubmenuClick(
                              !!submenuItem.hasSubmenu,
                              index,
                              childIndex
                            )
                          }
                        >
                          <span className="text-sm font-medium  tracking-wide">
                            {submenuItem.name}
                          </span>
                          {submenuItem.hasSubmenu && (
                            <ChevronRight
                              size={14}
                              className=" hover:text-blue-600 cursor-pointer"
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        <a
          href="/contact-us"
          className="w-full inline-block bg-blue-900 text-white py-3 px-4 rounded text-sm font-medium hover:bg-blue-800 transition-colors text-center"
        >
          BOOK AN APPOINTMENT
        </a>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center hover:text-blue-600">
            <Phone size={14} className="mr-1" />
            080-46520999
          </div>
          <div className="flex items-center hover:text-blue-600">
            <Phone size={14} className="mr-1" />
            +91 9036752277
          </div>
        </div>
      </div>
    </div>
  );

  const renderDestinationsPanel = () => {
    const activeItem = sidebarData[state.activeDropdown ?? -1];
    if (!activeItem || state.selectedFirst === null) return null;

    const destinationsSubmenu = activeItem.submenu?.[state.selectedFirst];
    if (!destinationsSubmenu) return null;

    return (
      <div
        className={`bg-gray-100 h-full flex flex-col border-r border-gray-200 ${
          state.isMobile ? "w-full" : "w-80"
        }`}
      >
        {state.isMobile && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="p-1 rounded mr-3 hover:text-blue-600 focus:outline-none"
                aria-label="Go Back"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-lg font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
                {destinationsSubmenu.name}
              </span>
            </div>
            <button
              onClick={resetState}
              className="p-1 rounded hover:bg-gray-100 focus:outline-none"
              aria-label="Close"
            >
              <X size={24} className="text-gray-600 hover:text-blue-600" />
            </button>
          </div>
        )}

        {destinationsSubmenu.submenu.length > 1 && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center cursor-pointer hover:text-blue-600">
              <a
                href={destinationsSubmenu.weblink}
                className="text-sm font-medium text-gray-800 uppercase tracking-wide hover:text-blue-600 cursor-pointer"
              >
                EXPLORE ALL {destinationsSubmenu.name}
              </a>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto ">
          {destinationsSubmenu.submenu?.map(
            (region: MenuItem, regionIndex: number) => (
              <div key={region.id} className="border-b border-gray-200">
                {region.weblink ? (
                  <LinkComponent
                    weblink={region.weblink}
                    name={region.name}
                    uppercase={false}
                  />
                ) : (
                  <div
                    className="flex items-center justify-between px-4 py-3 hover:text-blue-600 cursor-pointer"
                    onClick={() => handleSecondClick(regionIndex)}
                  >
                    <span className="text-sm font-medium text-gray-700 uppercase tracking-wide hover:text-blue-600 cursor-pointer">
                      {region.name}
                    </span>
                    {region.submenu && (
                      <ChevronRight
                        size={14}
                        className={`text-gray-400 transition-transform ${
                          state.secondActiveDropdown === regionIndex
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    )}
                  </div>
                )}
                {region.submenu &&
                  state.secondActiveDropdown === regionIndex && (
                    <div className="bg-gray-100  ">
                      {region.submenu.map((item: MenuItem, itemIndex) =>
                        item.weblink ? (
                          <a
                            href={item.weblink}
                            key={item.id}
                            className="flex items-center justify-between px-6 py-2 hover:text-blue-600 cursor-pointer border-b border-gray-200 last:border-b-0"
                          >
                            <span className="text-sm font-medium text-gray-800  tracking-wide hover:text-blue-600 cursor-pointer">
                              {item.name}
                            </span>
                          </a>
                        ) : (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-6 py-2 hover:text-blue-600 cursor-pointer border-b border-gray-200 last:border-b-0"
                            onClick={() =>
                              handleStateClick(regionIndex, itemIndex)
                            }
                          >
                            <span className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                              {item.name}
                            </span>
                            {item.submenu && (
                              <ChevronRight
                                size={12}
                                className="text-gray-400"
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const renderCitiesPanel = () => {
    if (
      state.activeDropdown === null ||
      state.selectedFirst === null ||
      state.selectedSecond === null ||
      state.selectedThird === null
    ) {
      return null;
    }

    const activeItem = sidebarData[state.activeDropdown];
    const destinationsSubmenu = activeItem.submenu?.[state.selectedFirst];
    const regionSubmenu = destinationsSubmenu?.submenu?.[state.selectedSecond];
    const stateSubmenu = regionSubmenu?.submenu?.[state.selectedThird];

    if (!stateSubmenu?.submenu) return null;

    return (
      <div
        className={`bg-gray-100 h-full flex flex-col ${
          state.isMobile ? "w-full" : "w-80"
        }`}
      >
        {state.isMobile && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="p-1 rounded mr-3 hover:text-blue-600 focus:outline-none"
                aria-label="Go Back"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-lg font-medium">{stateSubmenu.name}</span>
            </div>
            <button
              onClick={resetState}
              className="p-1 rounded hover:bg-gray-100 focus:outline-none"
              aria-label="Close"
            >
              <X size={24} className="text-gray-600 hover:text-blue-600" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {stateSubmenu.submenu.map((city) => (
            <div
              key={city.id}
              className="py-3 px-2 hover:text-blue-600 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              {city.weblink ? (
                <a
                  href={city.weblink}
                  className="text-sm font-medium text-gray-800 tracking-wide hover:text-blue-600 cursor-pointer"
                >
                  {city.name}
                </a>
              ) : (
                <span className="text-sm font-medium text-gray-800 uppercase tracking-wide hover:text-blue-600 cursor-pointer">
                  {city.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    document
      .getElementById("custom-sidebar")
      ?.addEventListener("click", toggleSidebar);
  }, []);

  useEffect(() => {
    const renderElement = document.getElementById("render");
    if (renderElement) {
      renderElement.style.display = state.isOpen ? "block" : "none";
    }
  }, [state.isOpen]);

  if (!state.isOpen || sidebarData == null) {
    return <div className="hidden"></div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className={`flex h-full ${state.isMobile ? "w-full" : ""}`}>
        {state.isMobile ? (
          // Mobile: Show only one panel at a time
          <>
            {state.activePanels.length === 0 && renderMainSidebar()}
            {state.activePanels.includes("destinations") &&
              !state.activePanels.includes("region") &&
              renderDestinationsPanel()}
            {state.activePanels.includes("region") &&
              !state.activePanels.includes("city") &&
              renderDestinationsPanel()}
            {state.activePanels.includes("city") && renderCitiesPanel()}
          </>
        ) : (
          // Desktop: Show panels side by side
          <>
            {renderMainSidebar()}
            {(state.selectedFirst !== null ||
              state.activePanels.includes("destinations")) &&
              renderDestinationsPanel()}
            {(state.selectedThird !== null ||
              state.activePanels.includes("city")) &&
              renderCitiesPanel()}
          </>
        )}
      </div>

      {/* Overlay */}
      <div className="flex-1 bg-black bg-opacity-50" onClick={resetState} />
    </div>
  );
};

export default MultiLevelSidebar;
