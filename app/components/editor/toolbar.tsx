import React from 'react';
import { Menu, Eye, Code, Moon, Sun, ArrowLeft, ArrowRight, Grid } from 'lucide-react';
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useEditor } from '~/contexts/editor-context';
import { RiStackLine } from 'react-icons/ri';

export const Toolbar = () => {
  const {
    isLeftPanelExpanded,
    setIsLeftPanelExpanded,
    gridVisible,
    setGridVisible,
    snapToGrid,
    setSnapToGrid,
    undo,
    redo,
    showCode,
    setShowCode,
    theme,
    setTheme,
    historyIndex,
    history
  } = useEditor();

  return (
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
                <Grid className="h-4 w-4" />
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
  );
};