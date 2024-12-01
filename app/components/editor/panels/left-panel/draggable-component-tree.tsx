import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Component } from '~/types/editor';
import { DraggableTreeItem } from './draggable-tree-item';
import { useEditor } from '~/contexts/editor-context';

interface DraggableComponentTreeProps {
  items: Component[];
  depth?: number;
  onReorder: (newOrder: Component[]) => void;
}

export const DraggableComponentTree: React.FC<DraggableComponentTreeProps> = ({
  items,
  depth = 0,
  onReorder
}) => {
  const { selectedId, setSelectedId } = useEditor();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(items, oldIndex, newIndex);
        onReorder(newOrder);
      }
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-0.5">
          {items.map(item => (
            <DraggableTreeItem 
              key={item.id} 
              item={item} 
              depth={depth}
              isSelected={item.id === selectedId}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};