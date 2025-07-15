import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ResolutionWarning = ({ resolutionStatus }) => {
  if (!resolutionStatus || resolutionStatus.warnings.length === 0) {
    return null;
  }

  const isCritical = resolutionStatus.isCritical;
  const bgColor = isCritical ? 'bg-red-100' : 'bg-yellow-100';
  const borderColor = isCritical ? 'border-red-500' : 'border-yellow-500';
  const textColor = isCritical ? 'text-red-700' : 'text-yellow-700';

  return (
    <div className={`p-3 rounded-md border-l-4 ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{isCritical ? 'Error de Resolución' : 'Alerta de Resolución'}</h3>
          <div className="mt-2 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              {resolutionStatus.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionWarning;