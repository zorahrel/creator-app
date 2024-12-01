import React from 'react';
import { ResizablePanel } from "~/components/ui/resizable";
import { Button } from "~/components/ui/button";
import { Sliders, ChevronsRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEditor } from '~/contexts/editor-context';
import PropertiesPanel from '~/components/properties-panel';

export const RightPanel = () => {
  const { 
    isRightPanelExpanded, 
    setIsRightPanelExpanded, 
    selectedComponent,
    updateComponents,
    deleteComponent,
    applyTextFormat
  } = useEditor();

  return (
    <ResizablePanel
      defaultSize={20}
      minSize={5}
      maxSize={30}
      className={`relative  ${isRightPanelExpanded ? '' : 'max-w-[48px]'}`}
    >
      {isRightPanelExpanded ? (
        <div className="h-full flex flex-col">
          {selectedComponent && (
            <ScrollArea className="flex-1">
              <PropertiesPanel
                selectedComponent={selectedComponent}
                updateComponents={updateComponents}
                deleteComponent={deleteComponent}
                applyTextFormat={applyTextFormat}
              />
            </ScrollArea>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={() => setIsRightPanelExpanded(false)}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
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
    </ResizablePanel>
  );
};