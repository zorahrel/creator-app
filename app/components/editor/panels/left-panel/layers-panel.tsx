import React from 'react';
import { ComponentTree } from './component-tree';
import { ComponentList } from './component-list';

export const LayersPanel = () => {
  return (
    <div className="p-2">
      <ComponentTree />
      <ComponentList />
    </div>
  );
}; 