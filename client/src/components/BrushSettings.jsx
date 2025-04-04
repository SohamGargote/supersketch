import React from 'react';
import { useAppContext } from '../provider/AppStates';

export const BrushSettings = () => {
  const { selectedElement, setElements, elements } = useAppContext();
  
  if (!selectedElement || selectedElement.tool !== 'brush') {
    return null;
  }
  
  const handleStrokeWidthChange = (e) => {
    const newWidth = parseInt(e.target.value);
    const updatedElement = {
      ...selectedElement,
      strokeWidth: newWidth
    };
    
    // Update the element in the elements array
    const updatedElements = elements.map(el => 
      el.id === selectedElement.id ? updatedElement : el
    );
    
    setElements(updatedElements);
  };
  
  return (
    <div className="brush-settings">
      <div className="brush-settings-header">
        <h3>Brush Settings</h3>
      </div>
      <div className="brush-settings-content">
        <div className="stroke-width-control">
          <label>Stroke Width</label>
          <input
            type="range"
            min="1"
            max="20"
            value={selectedElement.strokeWidth || 2}
            onChange={handleStrokeWidthChange}
          />
          <span>{selectedElement.strokeWidth || 2}px</span>
        </div>
      </div>
    </div>
  );
}; 