import React, { createContext, useContext, useState, useCallback } from 'react';
import { Component, EditorMode, ViewMode, Theme } from '~/types/editor';
import { generateUniqueId } from '~/utils/id';

interface EditorContextType {
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  selectedId: string;
  setSelectedId: (id: string) => void;
  selectedComponent: Component | null;
  showCode: boolean;
  setShowCode: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  panPosition: { x: number; y: number };
  setPanPosition: (position: { x: number; y: number }) => void;
  gridVisible: boolean;
  setGridVisible: (visible: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  history: Component[][];
  setHistory: React.Dispatch<React.SetStateAction<Component[][]>>;
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  isLeftPanelExpanded: boolean;
  setIsLeftPanelExpanded: (expanded: boolean) => void;
  isRightPanelExpanded: boolean;
  setIsRightPanelExpanded: (expanded: boolean) => void;
  addComponent: (parentId: string, component: Partial<Component>) => void;
  updateComponents: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (draggedId: string, targetId: string) => void;
  reorderComponents: (newOrder: Component[]) => void;
  updateComponentContent: (id: string, content: string) => void;
  applyTextFormat: (id: string, format: 'bold' | 'italic' | 'underline' | 'align', value?: string) => void;
  undo: () => void;
  redo: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>([
    {
      id: '1',
      type: 'div',
      name: 'Container',
      classes: ['p-4'],
      styles: {},
      children: []
    }
  ]);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [theme, setTheme] = useState<Theme>('light');
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [gridVisible, setGridVisible] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(8);
  const [editorMode, setEditorMode] = useState<EditorMode>('edit');
  const [history, setHistory] = useState<Component[][]>([components]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLeftPanelExpanded, setIsLeftPanelExpanded] = useState(true);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(true);

  const findComponent = useCallback((id: string): Component | null => {
    const find = (items: Component[]): Component | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children?.length) {
          const found = find(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return find(components);
  }, [components]);

  const selectedComponent = findComponent(selectedId);

  const addComponent = useCallback((parentId: string, newComponent: Partial<Component>) =>  {
    const fullComponent: Component = {
      id: generateUniqueId(),
      type: 'div',
      name: 'New Component',
      classes: [],
      styles: {},
      children: [],
      content: '',
      isTextComponent: ['p', 'h1', 'h2', 'h3', 'button', 'a'].includes(newComponent.type || ''),
      ...newComponent,
    };

    setComponents(prevComponents => {
      const newComponents = JSON.parse(JSON.stringify(prevComponents));
      const addToParent = (items: Component[]): boolean => {
        for (let item of items) {
          if (item.id === parentId) {
            if (item.isTextComponent) {
              const parentIndex = items.indexOf(item);
              items.splice(parentIndex + 1, 0, fullComponent);
            } else {
              item.children.push(fullComponent);
            }
            return true;
          }
          if (item.children.length && addToParent(item.children)) {
            return true;
          }
        }
        return false;
      };

      addToParent(newComponents);
      return newComponents;
    });

    setHistory(prev => [...prev.slice(0, historyIndex + 1), components]);
    setHistoryIndex(prev => prev + 1);
    setSelectedId(fullComponent.id);
  }, [components, historyIndex]);

  const updateComponents = useCallback((id: string, updates: Partial<Component>) => {
    setComponents(prevComponents => {
      const updateDeep = (items: Component[]): Component[] => {
        return items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              ...updates,
              styles: {
                ...item.styles,
                ...updates.styles,
              }
            };
          }
          if (item.children?.length) {
            return { ...item, children: updateDeep(item.children) };
          }
          return item;
        });
      };
      return updateDeep(prevComponents);
    });

    setHistory(prev => [...prev.slice(0, historyIndex + 1), components]);
    setHistoryIndex(prev => prev + 1);
  }, [components, historyIndex]);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => {
      const deleteDeep = (items: Component[]): Component[] => {
        return items.filter(item => item.id !== id).map(item => {
          if (item.children?.length) {
            return { ...item, children: deleteDeep(item.children) };
          }
          return item;
        });
      };
      return deleteDeep(prev);
    });
    setSelectedId('1');
  }, []);

  const moveComponent = useCallback((draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;

    setComponents(prev => {
      const newComponents = JSON.parse(JSON.stringify(prev));
      const removeFromParent = (items: Component[], id: string): Component | null => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            return items.splice(i, 1)[0];
          }
          if (items[i].children) {
            const removed = removeFromParent(items[i].children, id);
            if (removed) return removed;
          }
        }
        return null;
      };

      const addToParent = (items: Component[], parentId: string, component: Component) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === parentId) {
            items[i].children.push(component);
            return true;
          }
          if (items[i].children && addToParent(items[i].children, parentId, component)) {
            return true;
          }
        }
        return false;
      };

      const removedComponent = removeFromParent(newComponents, draggedId);
      if (removedComponent) {
        addToParent(newComponents, targetId, removedComponent);
      }

      return newComponents;
    });
  }, []);

  const reorderComponents = useCallback((newOrder: Component[]) => {
    setComponents(prevComponents => {
      const reorderDeep = (items: Component[]): Component[] => {
        return newOrder.map(newItem => {
          const originalItem = items.find(item => item.id === newItem.id);
          if (!originalItem) return newItem;
          return {
            ...originalItem,
            children: originalItem.children?.length ? reorderDeep(originalItem.children) : [],
          };
        });
      };
      return reorderDeep(prevComponents);
    });
  }, []);

  const updateComponentContent = useCallback((id: string, content: string) => {
    updateComponents(id, { content });
  }, [updateComponents]);

  const applyTextFormat = useCallback((id: string, format: 'bold' | 'italic' | 'underline' | 'align', value?: string) => {
    const component = findComponent(id);
    if (!component) return;

    let newStyles: React.CSSProperties = { ...component.styles };

    switch (format) {
      case 'bold':
        newStyles.fontWeight = newStyles.fontWeight === 'bold' ? 'normal' : 'bold';
        break;
      case 'italic':
        newStyles.fontStyle = newStyles.fontStyle === 'italic' ? 'normal' : 'italic';
        break;
      case 'underline':
        newStyles.textDecoration = newStyles.textDecoration === 'underline' ? 'none' : 'underline';
        break;
      case 'align':
        newStyles.textAlign = value as React.CSSProperties['textAlign'];
        break;
    }

    updateComponents(id, { styles: newStyles });
  }, [findComponent, updateComponents]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setComponents(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setComponents(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const value = {
    components,
    setComponents,
    selectedId,
    setSelectedId,
    selectedComponent,
    showCode,
    setShowCode,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    theme,
    setTheme,
    zoom,
    setZoom,
    panPosition,
    setPanPosition,
    gridVisible,
    setGridVisible,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    setGridSize,
    editorMode,
    setEditorMode,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    isLeftPanelExpanded,
    setIsLeftPanelExpanded,
    isRightPanelExpanded,
    setIsRightPanelExpanded,
    addComponent,
    updateComponents,
    deleteComponent,
    moveComponent,
    reorderComponents,
    updateComponentContent,
    applyTextFormat,
    undo,
    redo,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
