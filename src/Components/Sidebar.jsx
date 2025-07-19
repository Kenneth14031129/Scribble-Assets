import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Package,
  Heart,
  ChevronDown,
  ChevronRight,
  Trash,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, currentPage = "Dashboard" }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const toggleExpanded = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const navigation = [
    {
      name: "Dashboard",
      icon: Home,
      href: "/dashboard",
      current: location.pathname === "/dashboard",
    },
    {
      name: "Assets",
      icon: Package,
      href: "/assets",
      current: location.pathname === "/assets",
    },
    {
      name: "Disposed Assets",
      icon: Trash,
      href: "#",
      current: currentPage === "Diposed",
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-27 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Therapy Center
              </h1>
              <p className="text-xs text-gray-500">Asset Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name} className="mb-1">
              {item.href !== "#" ? (
                <Link
                  to={item.href}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    if (item.children) toggleExpanded(item.name);
                    onClose();
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.children && (
                    <div className="ml-auto">
                      {expandedItems[item.name] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => item.children && toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.children && (
                    <div className="ml-auto">
                      {expandedItems[item.name] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>
              )}

              {/* Submenu */}
              {item.children && expandedItems[item.name] && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
