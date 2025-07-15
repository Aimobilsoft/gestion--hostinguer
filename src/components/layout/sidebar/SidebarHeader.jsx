import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SidebarHeader = ({ isCollapsed, setIsCollapsed }) => {
  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between h-[69px]">
      {!isCollapsed && (
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm">Mobilsoft Solutions</h1>
            <p className="text-xs text-gray-500">MobilFood ERP</p>
          </div>
        </motion.div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="h-8 w-8 text-gray-500 hover:text-primary"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default SidebarHeader;