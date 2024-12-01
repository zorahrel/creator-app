import React from 'react';
import { Hand, ZoomIn, ZoomOut, Monitor, Tablet, Smartphone } from 'lucide-react';
import { RxCursorArrow } from 'react-icons/rx';
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Separator } from "~/components/ui/separator";
import { useEditor } from '~/contexts/editor-context';

export const Bottombar = () => {
  const {
    editorMode,
    setEditorMode,
    zoom,
    setZoom,
    viewMode,
    setViewMode
  } = useEditor();

  const zoomIn = () => setZoom(z => Math.min(z * 1.2, 4));
  const zoomOut = () => setZoom(z => Math.max(z / 1.2, 0.1));

  return (
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
  );
};