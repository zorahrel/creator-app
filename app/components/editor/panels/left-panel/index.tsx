import React from 'react';
import { ResizablePanel } from "~/components/ui/resizable";
import { Button } from "~/components/ui/button";
import { FiLayers, FiChevronsLeft } from 'react-icons/fi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useEditor } from '~/contexts/editor-context';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { PagesPanel } from './pages-panel';
import { LayersPanel } from './layers-panel';
import { LibraryPanel } from './library-panel';
import { FiBook, FiFolder, FiPackage } from 'react-icons/fi';

export const LeftPanel = () => {
  const { isLeftPanelExpanded, setIsLeftPanelExpanded } = useEditor();

  return (
    <ResizablePanel
      defaultSize={20}
      minSize={5}
      maxSize={30}
      className={`relative ${isLeftPanelExpanded ? '' : 'max-w-[48px]'}`}
    >
      {isLeftPanelExpanded ? (
        <div className="h-full flex flex-col">
          <Tabs defaultValue="layers" className="flex-1">
            <TabsList className="w-full justify-between">
              <TabsTrigger value="pages" className="flex items-center gap-2">
                <FiFolder className="h-4 w-4" />
                <span>Pages</span>
              </TabsTrigger>
              <TabsTrigger value="layers" className="flex items-center gap-2">
                <FiLayers className="h-4 w-4" />
                <span>Layers</span>
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2">
                <FiPackage className="h-4 w-4" />
                <span>Library</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="flex-1 overflow-auto">
              <PagesPanel />
            </TabsContent>
            
            <TabsContent value="layers" className="flex-1 overflow-auto">
              <LayersPanel />
            </TabsContent>
            
            <TabsContent value="library" className="flex-1 overflow-auto">
              <LibraryPanel />
            </TabsContent>
          </Tabs>

          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 left-2"
            onClick={() => setIsLeftPanelExpanded(false)}
          >
            <FiChevronsLeft className="h-4 w-4" />
          </Button>
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
              <TooltipContent side="right">Open Panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </ResizablePanel>
  );
};