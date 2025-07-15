import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const MainMenu = ({ modules, handleModuleClick, activeTab, currentModuleId, isCollapsed }) => {
  return (
    <motion.div
      key="main-menu"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-1"
    >
      {!isCollapsed && (
        <div className="px-2 py-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Módulos
          </h2>
        </div>
      )}
      {modules.map((module) => {
        const IconComponent = module.icon;
        const isActive = activeTab === module.id || currentModuleId === module.id;
        
        return (
          <motion.button
            key={module.id}
            onClick={() => handleModuleClick(module)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
              isActive 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-primary'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <div className="text-sm">{module.name}</div>
              </div>
            )}
            {!isCollapsed && module.subModules && (
              <Badge variant="secondary" className="text-xs">
                {module.subModules.length}
              </Badge>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default MainMenu;