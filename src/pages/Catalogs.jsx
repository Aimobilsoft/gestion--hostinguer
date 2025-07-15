import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Folder, ListTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Catalogs = ({ categories, productLines, onCategoryCreate, onCategoryEdit, onCategoryDelete, onLineCreate, onLineEdit, onLineDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center"><Folder className="mr-3" /> Categorías</h2>
          <Button onClick={onCategoryCreate} className="colombia-gradient-alt text-white">
            <Plus className="w-4 h-4 mr-2" /> Nueva Categoría
          </Button>
        </div>
        <motion.div layout className="space-y-4">
          {categories.map(cat => (
            <motion.div key={cat.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="invoice-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <Badge variant="secondary" className="mb-2">{cat.id}</Badge>
                    <p className="font-semibold">{cat.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline" onClick={() => onCategoryEdit(cat)}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="destructive" onClick={() => onCategoryDelete(cat.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center"><ListTree className="mr-3" /> Líneas de Productos</h2>
          <Button onClick={onLineCreate} className="colombia-gradient-alt text-white">
            <Plus className="w-4 h-4 mr-2" /> Nueva Línea
          </Button>
        </div>
         <motion.div layout className="space-y-4">
          {productLines.map(line => {
            const categoryName = categories.find(c => c.id === line.categoryId)?.name || 'Sin categoría';
            return (
              <motion.div key={line.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="invoice-card">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{line.name} <Badge variant="outline">{line.id}</Badge></p>
                      <p className="text-sm text-gray-500">{categoryName}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" onClick={() => onLineEdit(line)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive" onClick={() => onLineDelete(line.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

    </div>
  );
};

export default Catalogs;