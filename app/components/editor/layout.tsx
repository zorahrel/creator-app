import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "~/components/ui/resizable";
import { LeftPanel } from './panels/left-panel';
import { RightPanel } from './panels/right-panel';
import { Canvas } from './canvas';
import { Toolbar } from './toolbar';
import { Bottombar } from './bottombar';
import { useEditor } from '~/contexts/editor-context';

export const EditorLayout: React.FC = () => {
  const { theme } = useEditor();

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Toolbar />
      
      <div className="flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal">
          <LeftPanel />
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <Canvas />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <RightPanel />
        </ResizablePanelGroup>
        
        <Bottombar />
      </div>
    </div>
  );
};