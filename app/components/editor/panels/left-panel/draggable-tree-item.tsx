import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDrag, useDrop } from 'react-dnd';
import { ChevronDown, ChevronRight, GripVertical, Trash } from 'lucide-react';
import { Button } from "~/components/ui/button";
import { Component } from '~/types/editor';
import { useEditor } from '~/contexts/editor-context';
import { getComponentIcon } from '~/utils/component-icons';
import { cn } from '~/lib/utils';

interface DraggableTreeItemProps {
  item: Component;
  depth: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const DraggableTreeItem: React.FC<DraggableTreeItemProps> = ({ item, depth, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);

  const {
    selectedId,
    setSelectedId,
    moveComponent,
    updateComponents,
    deleteComponent
  } = useEditor();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'TREE_COMPONENT',
    item: () => ({ id: item.id, depth }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TREE_COMPONENT',
    canDrop: (draggedItem: { id: string, depth: number }) => {
      return draggedItem.id !== item.id && draggedItem.depth !== depth;
    },
    drop: (draggedItem: { id: string }) => {
      moveComponent(draggedItem.id, item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    if (editedName.trim() !== '') {
      updateComponents(item.id, { name: editedName.trim() });
    } else {
      setEditedName(item.name);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(item.name);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={cn(
          'flex items-center gap-1 py-1 px-2 rounded cursor-pointer text-xs',
          isDragging && 'opacity-50 bg-blue-100',
          isOver && canDrop && 'bg-green-100',
          isSelected && 'bg-blue-100',
          'hover:bg-gray-100'
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id);
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-4 h-4 flex items-center justify-center"
        >
          {item.children?.length > 0 && (
            isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />
          )}
        </button>
        <div className="cursor-move" ref={drag}>
          <GripVertical size={10} className="text-gray-400" />
        </div>
        <div className="w-4 h-4 flex items-center justify-center">
          {getComponentIcon(item.type)}
        </div>
        <div
          className="flex-1 truncate"
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="w-full bg-transparent outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            item.name
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 h-4 w-4 p-0"
          onClick={(e) => {
            e.stopPropagation();
            deleteComponent(item.id);
          }}
        >
          <Trash size={10} />
        </Button>
      </div>
      {isExpanded && item.children?.length > 0 && (
        <div ref={drop} onClick={(e) => e.stopPropagation()}>
          {item.children.map(child => (
            <DraggableTreeItem 
              key={child.id} 
              item={child} 
              depth={depth + 1} 
              isSelected={child.id === selectedId}
              onSelect={onSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};