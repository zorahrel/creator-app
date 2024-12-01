import React from 'react';
import { useEditor } from '~/contexts/editor-context';
import { Component } from '~/types/editor';
import { useDrag, useDrop } from 'react-dnd';
import { cn } from '~/lib/utils';

interface CanvasComponentProps {
  component: Component;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({ component }) => {
  const {
    selectedId,
    setSelectedId,
    moveComponent,
    updateComponentContent,
    applyTextFormat
  } = useEditor();

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'CANVAS_COMPONENT',
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'CANVAS_COMPONENT',
    drop: (draggedItem: { id: string, type: string }, monitor) => {
      if (!monitor.didDrop() && draggedItem.id !== component.id) {
        moveComponent(draggedItem.id, component.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const renderContent = () => {
    if (component.isTextComponent) {
      return (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateComponentContent(component.id, e.currentTarget.textContent || '')}
          onKeyDown={(e) => {
            if (e.metaKey || e.ctrlKey) {
              switch (e.key) {
                case 'b':
                  e.preventDefault();
                  applyTextFormat(component.id, 'bold');
                  break;
                case 'i':
                  e.preventDefault();
                  applyTextFormat(component.id, 'italic');
                  break;
                case 'u':
                  e.preventDefault();
                  applyTextFormat(component.id, 'underline');
                  break;
              }
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setSelectedId(component.id);
          }}
          dangerouslySetInnerHTML={{ __html: component.content || `Edit ${component.type} content` }}
        />
      );
    }

    return component.children.map(child => (
      <CanvasComponent key={child.id} component={child} />
    ));
  };

  const Element = component.type as keyof JSX.IntrinsicElements;

  return (
    <div ref={preview} className="relative group">
      <Element
        ref={drop}
        className={cn(
          component.classes.join(' '),
          'relative'
        )}
        style={{
          ...component.styles,
          opacity: isDragging ? 0.5 : 1,
          outline: isOver ? '2px dashed #4299e1' : selectedId === component.id ? '2px solid #3b82f6' : 'none',
        }}
      >
        <div
          ref={drag}
          className="absolute top-0 left-0 w-full h-full cursor-move"
          style={{ pointerEvents: 'none' }}
        />
        <div onClick={(e) => e.stopPropagation()}>{renderContent()}</div>
      </Element>
    </div>
  );
};