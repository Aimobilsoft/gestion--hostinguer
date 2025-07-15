import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Download, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FileUploadSection = ({ 
  attachments = [], 
  onAttachmentsChange, 
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    
    fileArray.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        toast({
          variant: 'destructive',
          title: 'Archivo muy grande',
          description: `${file.name} excede el tamaño máximo de ${Math.round(maxFileSize / 1024 / 1024)}MB`
        });
        return;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        toast({
          variant: 'destructive',
          title: 'Tipo de archivo no válido',
          description: `${file.name} no es un tipo de archivo permitido`
        });
        return;
      }

      // Check total files limit
      if (attachments.length + validFiles.length >= maxFiles) {
        toast({
          variant: 'destructive',
          title: 'Límite de archivos',
          description: `Solo se permiten máximo ${maxFiles} archivos`
        });
        return;
      }

      validFiles.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      });
    });

    if (validFiles.length > 0) {
      onAttachmentsChange([...attachments, ...validFiles]);
      toast({
        title: 'Archivos agregados',
        description: `${validFiles.length} archivo(s) agregado(s) exitosamente`
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (fileId) => {
    const updatedAttachments = attachments.filter(att => att.id !== fileId);
    onAttachmentsChange(updatedAttachments);
    toast({
      title: 'Archivo eliminado',
      description: 'El archivo ha sido eliminado de los anexos'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return <FileText className="w-5 h-5 text-red-500" />;
    if (['doc', 'docx'].includes(extension)) return <FileText className="w-5 h-5 text-blue-500" />;
    if (['jpg', 'jpeg', 'png'].includes(extension)) return <FileText className="w-5 h-5 text-green-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
      e.target.value = ''; // Reset input
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const viewFile = (attachment) => {
    // Create a temporary URL for the file
    const url = URL.createObjectURL(attachment.file);
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-purple-800 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Anexos y Documentos Soporte
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-purple-500 bg-purple-100' 
              : 'border-purple-300 hover:border-purple-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <p className="text-purple-700 mb-2">
            Arrastra archivos aquí o haz clic para seleccionar
          </p>
          <p className="text-sm text-purple-600 mb-4">
            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (máx. {Math.round(maxFileSize / 1024 / 1024)}MB)
          </p>
          
          <Button 
            type="button"
            variant="outline" 
            onClick={handleButtonClick}
            className="cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Seleccionar Archivos
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>

        {/* File List */}
        {attachments.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-purple-800 mb-2 block">
              Archivos Adjuntos ({attachments.length}/{maxFiles})
            </Label>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(attachment.name)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)} • {new Date(attachment.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewFile(attachment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFile(attachment.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800 mb-2">Documentos Recomendados:</h4>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• Orden de compra firmada</li>
            <li>• Factura del proveedor</li>
            <li>• Remisión o guía de transporte</li>
            <li>• Certificados de calidad</li>
            <li>• Fotografías de los productos recibidos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;