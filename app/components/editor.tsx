import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Copy, Trash, ChevronDown, ChevronRight, Code, Eye,
  Type, Box,
  Moon,
  Sliders, ArrowLeft,
  ArrowRight, List, Image, Link,
  Monitor, Tablet, Smartphone,
  Type as TypeIcon, Square, Image as ImageIcon,
  List as ListIcon, Link as LinkIcon, Table,
  Heading1, Heading2, Heading3, GripVertical,
  ChevronsLeft, ChevronsRight, Menu, MoreHorizontal,
  Minus, Plus, RotateCcw, Maximize,
  Hand, ZoomIn, ZoomOut, 
} from 'lucide-react';
import { useDrag, useDrop, useDragControls, useDragLayer } from 'react-dnd';
import PropertiesPanel from './properties-panel';
import { motion, useMotionValue, useTransform } from "framer-motion";

// Import shadcn components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "~/components/ui/resizable"
import { ScrollArea } from "~/components/ui/scroll-area";
import { FiGrid, FiLayers, FiBox, FiType, FiChevronDown, FiImage, FiLink, FiList, FiTable, FiCheckSquare, FiMoreHorizontal, FiChevronsLeft, FiSliders, FiCalendar, FiVideo, FiMapPin, FiStar, FiToggleLeft, FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify, FiBold, FiItalic, FiUnderline, FiDroplet, FiLayout, FiColumns, FiNavigation, FiMenu, FiMessageSquare, FiUser, FiMail, FiLock, FiSearch, FiUpload, FiDownload, FiPrinter, FiShare2, FiTag, FiBookmark, FiHeart, FiThumbsUp, FiThumbsDown, FiClock, FiLoader, FiAlertTriangle, FiCheckCircle, FiXCircle, FiInfo, FiBell, FiSettings, FiTool, FiRefreshCw, FiFilter, FiEdit, FiTrash2, FiCopy, FiPaperclip, FiSave, FiEye, FiEyeOff, FiZoomIn, FiZoomOut, FiMaximize, FiMinimize } from 'react-icons/fi';
import { BiSquare } from 'react-icons/bi';
import { MdRateReview } from 'react-icons/md';
import { IoMdOptions } from 'react-icons/io';
import { TbH1, TbH2, TbH3 } from 'react-icons/tb';
import { BsInputCursor } from 'react-icons/bs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useToast } from "~/components/ui/hooks/use-toast";
import { Separator } from "~/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { cn } from '~/lib/utils';
import { RiStackLine } from 'react-icons/ri';
import { RxCursorArrow } from 'react-icons/rx';

// Add these new imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Type definitions
type Component = {
  id: string;
  type: string;
  name: string;
  classes: string[];
  styles: React.CSSProperties;
  children: Component[];
  content?: string;
  isTextComponent?: boolean; // Add this new property
};

// Update the props type for DraggableComponentTree
type DraggableComponentTreeProps = {
  items: Component[];
  depth?: number;
  onReorder: (newOrder: Component[]) => void;
};

const DraggableComponent: React.FC<{
  component: Component;
  renderContent: () => React.ReactNode;
  onMove: (draggedId: string, targetId: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  inverseScale: number; // Add this new prop
}> = ({ component, renderContent, onMove, isSelected, onSelect, onDelete, onDuplicate, inverseScale }) => {
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
        onMove(draggedItem.id, component.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const Element = component.type as keyof JSX.IntrinsicElements;

  return (
    <div 
      ref={preview} 
      className="relative group"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected && (
        <div 
          className="absolute top-0 left-0 -mt-8 flex items-center space-x-2 bg-white shadow-sm rounded px-2 py-1 text-xs z-10"
          style={{ transform: `scale(${inverseScale})`, transformOrigin: 'top left' }} // Add this style
        >
          <span className="text-gray-500">{component.name}</span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="flex flex-col space-y-1">
                <button
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={() => onDuplicate(component.id)}
                >
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded text-red-500"
                  onClick={() => onDelete(component.id)}
                >
                  <Trash size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <Element
        ref={drop}
        className={`${component.classes.join(' ')} relative`}
        style={{
          ...component.styles,
          opacity: isDragging ? 0.5 : 1,
          outline: isOver ? '2px dashed #4299e1' : isSelected ? '2px solid #3b82f6' : 'none',
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

const Editor: React.FC = () => {
  // State variables
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
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gridVisible, setGridVisible] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(8);
  const [editorMode, setEditorMode] = useState<'edit' | 'pan'>('edit');
  const isPanning = useRef(false);
  const lastPanPosition = useRef({ x: 0, y: 0 });

  // New state for undo/redo functionality
  const [history, setHistory] = useState<Component[][]>([components]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Add this new state
  const [isLeftPanelExpanded, setIsLeftPanelExpanded] = useState(true);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(true);

  const { toast } = useToast();

  // Memoized utility functions
  const findDeep = useCallback((items: Component[], id: string): Component | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children?.length) {
        const found = findDeep(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedComponent = useMemo(() => findDeep(components, selectedId) || components[0], [components, selectedId, findDeep]);

  // Updated addComponent function
  const addComponent = useCallback((parentId: string, newComponent: Partial<Component>) => {
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

    // If it's a text component, ensure it has no children
    if (fullComponent.isTextComponent) {
      fullComponent.children = [];
    }

    setComponents(prevComponents => {
      const newComponents = JSON.parse(JSON.stringify(prevComponents));
      const addToParent = (items: Component[]): boolean => {
        for (let item of items) {
          if (item.id === parentId) {
            // Check if the parent is a text component
            if (item.isTextComponent) {
              // If parent is a text component, add the new component as a sibling
              const parentIndex = items.indexOf(item);
              items.splice(parentIndex + 1, 0, fullComponent);
            } else {
              // If parent is not a text component, add as a child
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

    // Update history after state has been set
    setHistory(prev => [...prev.slice(0, historyIndex + 1), components]);
    setHistoryIndex(prev => prev + 1);

    setSelectedId(fullComponent.id);
  }, [components, historyIndex]);

  // Enhanced updateComponents function with history tracking
  const updateComponents = useCallback((id: string, updates: Partial<Component>) => {
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
    setComponents(prev => {
      const updatedComponents = updateDeep(prev);
      setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), updatedComponents]);
      setHistoryIndex(prevIndex => prevIndex + 1);
      return updatedComponents;
    });
  }, [historyIndex]);

  // New function to generate a unique ID
  const generateUniqueId = () => `component-${Math.random().toString(36).substr(2, 9)}`;

  const deleteComponent = useCallback((id: string) => {
    const deleteDeep = (items: Component[]): Component[] => {
      return items.filter(item => item.id !== id).map(item => {
        if (item.children?.length) {
          return { ...item, children: deleteDeep(item.children) };
        }
        return item;
      });
    };
    setComponents(prev => deleteDeep(prev));
    setSelectedId('1'); // Reset to root
  }, []);

  // Move isValidNesting function here and memoize it
  const isValidNesting = useCallback((childType: string, parentType: string): boolean => {
    const nestingRules: { [key: string]: string[] } = {
      div: ['div', 'p', 'h1', 'h2', 'h3', 'button', 'input', 'textarea', 'img', 'a', 'ul', 'ol', 'table'],
      p: ['a', 'span', 'strong', 'em', 'br'],
      h1: ['a', 'span', 'strong', 'em'],
      h2: ['a', 'span', 'strong', 'em'],
      h3: ['a', 'span', 'strong', 'em'],
      button: ['span', 'strong', 'em'],
      a: ['span', 'strong', 'em'],
      ul: ['li'],
      ol: ['li'],
      li: ['p', 'a', 'span', 'strong', 'em'],
      table: ['thead', 'tbody', 'tfoot'],
      thead: ['tr'],
      tbody: ['tr'],
      tfoot: ['tr'],
      tr: ['th', 'td'],
      th: ['p', 'a', 'span', 'strong', 'em'],
      td: ['p', 'a', 'span', 'strong', 'em'],
    };

    if (!nestingRules[parentType]) return true; // If no specific rules, allow nesting
    return nestingRules[parentType].includes(childType);
  }, []);

  // Modify the moveComponent function
  const moveComponent = useCallback((draggedId: string, targetId: string) => {
    const draggedItem = findDeep(components, draggedId);
    const targetItem = findDeep(components, targetId);
    if (!draggedItem || !targetItem || draggedId === targetId) return;

    // Check if the target is a descendant of the dragged item
    const isDescendant = (parent: Component, childId: string): boolean => {
      if (parent.id === childId) return true;
      return parent.children.some(child => isDescendant(child, childId));
    };

    if (isDescendant(draggedItem, targetId)) {
      toast({
        title: "Invalid move",
        description: "Cannot move a parent into its own child.",
        variant: "destructive",
      });
      return;
    }

    // Check nesting rules
    if (!isValidNesting(draggedItem.type, targetItem.type)) {
      toast({
        title: "Invalid nesting",
        description: `Cannot place ${draggedItem.type} inside ${targetItem.type}.`,
        variant: "destructive",
      });
      return;
    }

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

      // Update history after state has been set
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newComponents]);
      setHistoryIndex(prev => prev + 1);

      return newComponents;
    });
  }, [components, findDeep, isValidNesting, toast, historyIndex]);

  // Add this helper function to find the parent of a component
  const findParent = (items: Component[], id: string): Component | null => {
    for (const item of items) {
      if (item.children?.some(child => child.id === id)) {
        return item;
      }
      if (item.children) {
        const parent = findParent(item.children, id);
        if (parent) return parent;
      }
    }
    return null;
  };

  // Add a new function to update component content
  const updateComponentContent = useCallback((id: string, content: string) => {
    setComponents(prevComponents => {
      const updateDeep = (items: Component[]): Component[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, content };
          }
          if (item.children?.length) {
            return { ...item, children: updateDeep(item.children) };
          }
          return item;
        });
      };
      return updateDeep(prevComponents);
    });
  }, []);

  const applyTextFormat = useCallback((id: string, format: 'bold' | 'italic' | 'underline' | 'align', value?: string) => {
    const component = findDeep(components, id);
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
  }, [components, findDeep, updateComponents]);

  // Add this new function to calculate the inverse scale
  const getInverseScale = useCallback(() => {
    return 1 / zoom;
  }, [zoom]);

  // Modify the renderComponent function
  const renderComponent = useCallback((component: Component): React.ReactNode => {
    const renderContent = () => {
      if (component.isTextComponent) {
        return (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e: React.FocusEvent<HTMLDivElement>) =>
              updateComponentContent(component.id, e.currentTarget.textContent || '')
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
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
            onMouseDown={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedId(component.id);
            }}
            dangerouslySetInnerHTML={{ __html: component.content || `Edit ${component.type} content` }}
          />
        );
      } else if (component.children.length > 0) {
        return component.children.map(child => renderComponent(child));
      } else if (component.type === 'img') {
        return <img src={component.content || 'https://via.placeholder.com/150'} alt="Component" />;
      } else if (component.type === 'input') {
        return (
          <input
            type="text"
            placeholder={`Edit ${component.type} placeholder`}
            value={component.content || ''}
            onChange={(e) => updateComponentContent(component.id, e.target.value)}
            onMouseDown={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedId(component.id);
            }}
          />
        );
      } else if (component.type === 'textarea') {
        return (
          <textarea
            placeholder={`Edit ${component.type} placeholder`}
            value={component.content || ''}
            onChange={(e) => updateComponentContent(component.id, e.target.value)}
            onMouseDown={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedId(component.id);
            }}
          />
        );
      }
      return null;
    };

    return (
      <DraggableComponent
        key={component.id}
        component={component}
        renderContent={renderContent}
        onMove={moveComponent}
        isSelected={selectedId === component.id}
        onSelect={() => setSelectedId(component.id)}
        onDelete={deleteComponent}
        onDuplicate={(id) => {
          const componentToDuplicate = findDeep(components, id);
          if (componentToDuplicate) {
            const parentComponent = findParent(components, id);
            if (parentComponent) {
              addComponent(parentComponent.id, { ...componentToDuplicate, id: generateUniqueId() });
            }
          }
        }}
        inverseScale={getInverseScale()} // Add this new prop
      />
    );
  }, [selectedId, updateComponentContent, applyTextFormat, moveComponent, deleteComponent, addComponent, components, findDeep, findParent, generateUniqueId, setSelectedId, getInverseScale]);

  // Memoized style presets
  const stylePresets = useMemo(() => ({
    layout: ['flex', 'grid', 'flex-col', 'flex-row', 'items-center', 'justify-center'],
    spacing: ['p-1', 'p-2', 'p-4', 'm-1', 'm-2', 'm-4'],
    typography: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'font-bold', 'font-light'],
    color: ['text-gray-700', 'text-blue-500', 'bg-gray-100', 'bg-blue-500'],
    borders: ['border', 'border-2', 'rounded', 'rounded-lg'],
    effects: ['shadow', 'shadow-lg', 'opacity-50'],
  }), []);

  // Modify the DraggableComponentTree component
  const DraggableComponentTree: React.FC<DraggableComponentTreeProps> = ({ items, depth = 0, onReorder }) => {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = (event: any) => {
      const { active, over } = event;

      if (active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        onReorder(newOrder);
      }
    };

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <DraggableTreeItem key={item.id} item={item} depth={depth} />
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  // Modify the DraggableTreeItem component
  const DraggableTreeItem: React.FC<{ item: Component, depth: number }> = ({ item, depth }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(item.name);
    
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const [{ isDragging }, drag, preview] = useDrag({
      type: 'TREE_COMPONENT',
      item: () => ({ id: item.id, depth }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver, canDrop }, drop] = useDrop({
      accept: 'TREE_COMPONENT',
      canDrop: (draggedItem: { id: string, depth: number }) => {
        return draggedItem.id !== item.id && draggedItem.depth !== depth;DndContext
      },
      drop: (draggedItem: { id: string }) => {
        moveComponent(draggedItem.id, item.id);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    });

    const getItemStyle = () => {
      if (isDragging) return "opacity-50 bg-blue-100";
      if (isOver && canDrop) return "bg-green-100";
      if (selectedId === item.id) return "bg-blue-100";
      return "hover:bg-gray-100";
    };

    const getIcon = () => {
      switch (item.type) {
        case 'div': return <Square size={12} />;
        case 'p': return <TypeIcon size={12} />;
        case 'h1': case 'h2': case 'h3': return <Heading1 size={12} />;
        case 'button': return <Square size={12} />;
        case 'input': case 'textarea': return <Type size={12} />;
        case 'img': return <Image size={12} />;
        case 'a': return <Link size={12} />;
        case 'ul': case 'ol': return <List size={12} />;
        case 'table': return <Table size={12} />;
        default: return <Box size={12} />;
      }
    };

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

    const handleItemClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedId(item.id);
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          className={`flex items-center gap-1 py-1 px-2 rounded cursor-pointer text-xs ${getItemStyle()}`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={handleItemClick}
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
          <div className="cursor-move" onClick={(e) => e.stopPropagation()}>
            <GripVertical size={10} className="text-gray-400" />
          </div>
          <div className="w-4 h-4 flex items-center justify-center">
            {getIcon()}
          </div>
          <div
            className="flex-1 truncate"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
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
          <DraggableComponentTree items={item.children} depth={depth + 1} onReorder={(newOrder) => {
            // Handle reordering of children
            updateComponents(item.id, { children: newOrder });
          }} />
        )}
      </div>
    );
  };

  const componentTypes = [
    { type: 'div', name: 'Container', icon: <FiBox /> },
    { type: 'p', name: 'Paragraph', icon: <FiType /> },
    { type: 'h1', name: 'Heading 1', icon: <TbH1 /> },
    { type: 'h2', name: 'Heading 2', icon: <TbH2 /> },
    { type: 'h3', name: 'Heading 3', icon: <TbH3 /> },
    { type: 'button', name: 'Button', icon: <BiSquare /> },
    { type: 'input', name: 'Input', icon: <BsInputCursor /> },
    { type: 'textarea', name: 'Text Area', icon: <FiAlignLeft /> },
    { type: 'img', name: 'Image', icon: <FiImage /> },
    { type: 'a', name: 'Link', icon: <FiLink /> },
    { type: 'ul', name: 'Unordered List', icon: <FiList /> },
    { type: 'ol', name: 'Ordered List', icon: <FiList /> },
    { type: 'table', name: 'Table', icon: <FiTable /> },
    { type: 'checkbox', name: 'Checkbox', icon: <FiCheckSquare /> },
    { type: 'radio', name: 'Radio', icon: <FiCheckCircle /> },
    { type: 'select', name: 'Select', icon: <FiChevronDown /> },
    { type: 'date', name: 'Date Picker', icon: <FiCalendar /> },
    { type: 'video', name: 'Video', icon: <FiVideo /> },
    { type: 'map', name: 'Map', icon: <FiMapPin /> },
    { type: 'rating', name: 'Rating', icon: <MdRateReview /> },
    { type: 'toggle', name: 'Toggle', icon: <FiToggleLeft /> },
    { type: 'icon', name: 'Icon', icon: <FiStar /> },
    { type: 'progress', name: 'Progress Bar', icon: <FiLoader /> },
    { type: 'slider', name: 'Slider', icon: <FiSliders /> },
    { type: 'card', name: 'Card', icon: <FiLayout /> },
    { type: 'avatar', name: 'Avatar', icon: <FiUser /> },
    { type: 'badge', name: 'Badge', icon: <FiTag /> },
    { type: 'alert', name: 'Alert', icon: <FiAlertTriangle /> },
    { type: 'tooltip', name: 'Tooltip', icon: <FiInfo /> },
    { type: 'accordion', name: 'Accordion', icon: <FiChevronDown /> },
    { type: 'tabs', name: 'Tabs', icon: <IoMdOptions /> },
    { type: 'modal', name: 'Modal', icon: <FiMaximize /> },
    { type: 'dropdown', name: 'Dropdown', icon: <FiChevronDown /> },
    { type: 'pagination', name: 'Pagination', icon: <FiMoreHorizontal /> },
    { type: 'breadcrumb', name: 'Breadcrumb', icon: <FiNavigation /> },
    { type: 'menu', name: 'Menu', icon: <FiMenu /> },
  ];

  // New undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setComponents(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // New redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setComponents(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Updated zoom functions
  const zoomIn = useCallback(() => setZoom(z => Math.min(z * 1.2, 4)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(z / 1.2, 0.1)), []);

  // Updated handleWheel function
  const handleWheel = useCallback((event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prevZoom => {
        const newZoom = prevZoom * zoomFactor;
        return Math.min(Math.max(0.1, newZoom), 4);
      });
    } else if (editorMode === 'pan') {
      setPanPosition(prev => ({
        x: prev.x - event.deltaX,
        y: prev.y - event.deltaY,
      }));
    }
  }, [editorMode]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (editorMode === 'pan') {
      isPanning.current = true;
      lastPanPosition.current = { x: event.clientX, y: event.clientY };
    }
  }, [editorMode]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isPanning.current) {
      const deltaX = event.clientX - lastPanPosition.current.x;
      const deltaY = event.clientY - lastPanPosition.current.y;
      setPanPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      lastPanPosition.current = { x: event.clientX, y: event.clientY };
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
    }

    // Add this new event listener
    const preventDefault = (e: WheelEvent) => {
      if (e.ctrlKey || editorMode === 'pan') {
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', preventDefault, { passive: false });

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      // Remove the event listener on cleanup
      window.removeEventListener('wheel', preventDefault);
    };
  }, [handleWheel, handleMouseUp, editorMode]);

  const canvasStyle = useMemo(() => ({
    transform: `scale(${zoom}) translate(${panPosition.x}px, ${panPosition.y}px)`,
    transformOrigin: '0 0',
  }), [zoom, panPosition.x, panPosition.y, editorMode]);

  const getViewportSize = useCallback(() => {
    switch (viewMode) {
      case 'desktop': return { width: '100%', height: '100%' };
      case 'tablet': return { width: '768px', height: '1024px' };
      case 'mobile': return { width: '375px', height: '667px' };
    }
  }, [viewMode]);

  // Modify the handleCanvasClick function
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Check if the click is directly on the gray background
    if (e.target === e.currentTarget) {
      setSelectedId('');
    }
  }, []);

  // Add this new function to handle keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return; // Ignore shortcuts when typing in input fields
    }
    
    switch (event.key.toLowerCase()) {
      case 'h':
        setEditorMode('pan');
        break;
      case 'v':
        setEditorMode('edit');
        break;
    }
  }, []);

  useEffect(() => {
    // ... existing event listeners ...
    
    // Add the new keyboard event listener
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // ... existing cleanup ...
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleMouseUp, editorMode, handleKeyDown]);

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

  // Main render
  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Single Merged Header */}
      <div className="h-12 border-b flex items-center justify-between px-4 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <Menu className="h-5 w-5 cursor-pointer" onClick={() => setIsLeftPanelExpanded(!isLeftPanelExpanded)} />
          <span className="font-semibold text-sm">Component Builder</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Grid and snap controls */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setGridVisible(!gridVisible)}>
                  <FiGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle grid</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setSnapToGrid(!snapToGrid)}>
                  <RiStackLine className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle snap to grid</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Undo/Redo controls */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex === 0}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex === history.length - 1}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Code/Preview toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowCode(!showCode)}>
                  {showCode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showCode ? "Preview" : "Show code"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Theme toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel */}
          <ResizablePanel
            defaultSize={20}
            minSize={isLeftPanelExpanded ? 15 : 5}
            maxSize={30}
            className={isLeftPanelExpanded ? '' : 'w-12'}
          >
            <div className="h-full flex flex-col relative">
              {isLeftPanelExpanded ? (
                <div className="p-2 flex-1 overflow-auto">
                  <Input
                    placeholder="Search layers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <DraggableComponentTree items={components} onReorder={reorderComponents} />
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Add Component</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {componentTypes.map(({ type, name, icon }) => (
                        <TooltipProvider key={type}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-16 w-full p-1 flex flex-col items-center justify-center text-xs"
                                onClick={() => {
                                  const newComponent: Component = {
                                    id: generateUniqueId(),
                                    type,
                                    name: `New ${name}`,
                                    classes: [],
                                    styles: {},
                                    children: [],
                                    content: '',
                                    isTextComponent: ['p', 'h1', 'h2', 'h3', 'button', 'a'].includes(type || ''),
                                  };
                                  addComponent(selectedId, newComponent);
                                }}
                              >
                                {React.cloneElement(icon, { className: "h-6 w-6 mb-1" })}
                                <span className="truncate w-full">{name}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{name}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2 space-y-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setIsLeftPanelExpanded(true)}>
                          <FiLayers className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Layers</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2"
                onClick={() => setIsLeftPanelExpanded(!isLeftPanelExpanded)}
              >
                {isLeftPanelExpanded ? <FiChevronsLeft className="h-4 w-4" /> : <FiChevronsRight className="h-4 w-4" />}
              </Button>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Panel - Canvas */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full flex flex-col">
              <div 
                  ref={canvasRef} className={cn("flex-1 bg-gray-100", editorMode === 'pan' ? 'cursor-grab' : 'cursor-default')} onClick={handleCanvasClick} 
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}>
                <div
                  className="w-full h-full"
                  style={canvasStyle}
                >
                  <div 
                    className="mx-auto bg-white shadow-lg" 
                    style={getViewportSize()}
                  >
                    {renderComponent(components[0])}
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Properties */}
          <ResizablePanel
            defaultSize={20}
            minSize={isRightPanelExpanded ? 15 : 5}
            maxSize={30}
            className={isRightPanelExpanded ? '' : 'w-12'}
          >
            <div className="h-full flex flex-col relative">
              {isRightPanelExpanded ? (
                selectedComponent && (
                  <PropertiesPanel
                    selectedComponent={selectedComponent}
                    updateComponents={updateComponents}
                    deleteComponent={deleteComponent}
                  />
                )
              ) : (
                <div className="flex flex-col items-center py-2 space-y-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setIsRightPanelExpanded(true)}>
                          <Sliders className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Properties</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 left-2"
                onClick={() => setIsRightPanelExpanded(!isRightPanelExpanded)}
              >
                {isRightPanelExpanded ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
              </Button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        
        {/* Updated Bottombar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-3 py-1.5 flex items-center space-x-3">
          <ToggleGroup type="single" value={editorMode} onValueChange={(value) => setEditorMode(value as 'edit' | 'pan')}>
            <ToggleGroupItem value="edit" aria-label="Edit mode">
              <RxCursorArrow className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="pan" aria-label="Pan mode">
              <Hand className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={zoomOut}><ZoomOut className="h-4 w-4" /></Button>
            <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={zoomIn}><ZoomIn className="h-4 w-4" /></Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => setViewMode(value as 'desktop' | 'tablet' | 'mobile')}>
            <ToggleGroupItem value="desktop" aria-label="Desktop view">
              <Monitor className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="tablet" aria-label="Tablet view">
              <Tablet className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="mobile" aria-label="Mobile view">
              <Smartphone className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default Editor;
