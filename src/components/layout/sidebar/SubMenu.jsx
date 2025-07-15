import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SubMenu = ({ activeModule, handleSubModuleClick, handleBackToMain, activeTab, isCollapsed }) => {
  return (
    <motion.div
      key="sub-menu"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-1"
    >
      {!isCollapsed && (
        <div className="px-2 py-2 border-b border-gray-200 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToMain}
            className="mb-2 text-gray-600 hover:text-primary w-full justify-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al menú
          </Button>
          <div className="flex items-center space-x-3 p-2">
            <activeModule.icon className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-semibold text-gray-800">{activeModule.name}</h2>
              <p className="text-xs text-gray-500">{activeModule.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {activeModule.subModules?.map((subModule) => {
        const IconComponent = subModule.icon;
        const isActive = activeTab === subModule.id;
        
        return (
          <motion.button
            key={subModule.id}
            onClick={() => handleSubModuleClick(subModule)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-primary'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconComponent className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`} />
            {!isCollapsed && (
              <span className="font-medium text-sm">{subModule.name}</span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default SubMenu;