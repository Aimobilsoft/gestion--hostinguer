import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Warehouse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = ({ currentBranch, currentWarehouse }) => {
  return (
    <motion.header 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-30"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">MS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mobilsoft Solutions</h1>
                <p className="text-xs text-muted-foreground">MobilFood ERP</p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentBranch && (
              <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div className="text-foreground">
                  <p className="text-sm font-medium">{currentBranch.name}</p>
                  <p className="text-xs text-muted-foreground">{currentBranch.code}</p>
                </div>
              </div>
            )}
            
            {currentWarehouse && (
              <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                <Warehouse className="w-4 h-4 text-muted-foreground" />
                <div className="text-foreground">
                  <p className="text-sm font-medium">{currentWarehouse.name}</p>
                  <p className="text-xs text-muted-foreground">{currentWarehouse.code}</p>
                </div>
              </div>
            )}
            
            <Badge className="bg-green-500/10 text-green-700 border border-green-500/20 pulse-glow">
              Sistema Activo
            </Badge>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;