import React from 'react';
import { Input } from "~/components/ui/input";
import { useEditor } from '~/contexts/editor-context';
import { DraggableComponentTree } from './draggable-component-tree';

export const ComponentTree = () => {
  const { searchTerm, setSearchTerm, components, reorderComponents } = useEditor();

  return (
    <>
      <Input
        placeholder="Search layers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <DraggableComponentTree
        items={components}
        onReorder={reorderComponents}
      />
    </>
  );
};