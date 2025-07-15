import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, FileText } from 'lucide-react';

const BreadcrumbNav = ({ isCollapsed, handleBackToModule, handleBackToMain, moduleName }) => {
  return (
    <motion.div
      key="breadcrumb-view"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {!isCollapsed && (
        <div className="px-2 py-2 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToModule}
            className="mb-2 text-gray-600 hover:text-gray-800 w-full justify-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a {moduleName}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToMain}
            className="text-gray-600 hover:text-gray-800 w-full justify-start"
          >
            <Home className="w-4 h-4 mr-2" />
            Menú Principal
          </Button>
        </div>
      )}
      
      <div className="px-2">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Estás en: {moduleName}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Usa los botones de arriba para navegar
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BreadcrumbNav;