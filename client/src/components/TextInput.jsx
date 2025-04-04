import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../provider/AppStates";
import { updateElement } from "../helper/element";

export default function TextInput() {
  const { selectedElement, setSelectedElement, elements, setElements } = useAppContext();
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedElement && selectedElement.tool === "text") {
      setText(selectedElement.text || "Text");
      setFontSize(selectedElement.fontSize || 16);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [selectedElement]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (selectedElement) {
      updateElement(
        selectedElement.id,
        { text: e.target.value },
        setElements,
        elements,
        true
      );
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    if (selectedElement) {
      updateElement(
        selectedElement.id,
        { fontSize: newSize },
        setElements,
        elements,
        true
      );
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (!isEditing) return null;

  return (
    <div className="text-input-container">
      <div className="text-input-header">
        <h3>Edit Text</h3>
        <button onClick={handleBlur}>Done</button>
      </div>
      <div className="text-input-content">
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text..."
        />
        <div className="font-size-control">
          <label htmlFor="fontSize">Font Size:</label>
          <input
            type="range"
            id="fontSize"
            min="8"
            max="72"
            value={fontSize}
            onChange={handleFontSizeChange}
          />
          <span>{fontSize}px</span>
        </div>
      </div>
    </div>
  );
} 