import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronsLeft, ChevronsRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuConfig } from '@/config/menuConfig.jsx';

const SidebarHeader = ({ isCollapsed }) => (
  <div className="flex items-center justify-center h-16 border-b border-gray-700">
    <motion.div
      initial={false}
      animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden whitespace-nowrap"
    >
      <span className="text-xl font-bold text-white">MobilFood ERP</span>
    </motion.div>
  </div>
);

const NavItem = ({ item, activeTab, setActiveTab, isCollapsed }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    item.subItems?.some(sub => sub.path === activeTab) || false
  );

  const isActive = item.path === activeTab || item.subItems?.some(sub => sub.path === activeTab);

  const handleItemClick = () => {
    if (item.subItems) {
      setIsSubMenuOpen(!isSubMenuOpen);
    } else {
      setActiveTab(item.path);
    }
  };

  return (
    <li>
      <Button
        variant="ghost"
        onClick={handleItemClick}
        className={`w-full justify-start text-sm font-medium h-12 ${
          isActive ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {item.icon}
        {!isCollapsed && <span className="ml-4 truncate">{item.label}</span>}
        {!isCollapsed && item.subItems && (
          <ChevronDown
            className={`ml-auto h-4 w-4 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`}
          />
        )}
      </Button>
      <AnimatePresence>
        {!isCollapsed && isSubMenuOpen && item.subItems && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-8"
          >
            {item.subItems.map((subItem) => (
              <li key={subItem.id}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(subItem.path)}
                  className={`w-full justify-start text-xs h-10 ${
                    activeTab === subItem.path ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {subItem.icon}
                  <span className="ml-3">{subItem.label}</span>
                </Button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, onCreateInvoice }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white flex flex-col transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <SidebarHeader isCollapsed={isCollapsed} />
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        <ul>
          {menuConfig.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCollapsed={isCollapsed}
            />
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <Button
          onClick={onCreateInvoice}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold"
        >
          <PlusCircle className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} />
          {!isCollapsed && 'Nueva Factura'}
        </Button>
      </div>
      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-6 w-6 bg-gray-700 hover:bg-blue-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;