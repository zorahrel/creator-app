import React, { useCallback, useRef, useEffect } from 'react';
import { cn } from "~/lib/utils";
import { useEditor } from '~/contexts/editor-context';
import { CanvasComponent } from './canvas-component';

export const Canvas = () => {
  const {
    components,
    editorMode,
    zoom,
    setZoom,
    panPosition,
    setPanPosition,
    viewMode,
    setSelectedId
  } = useEditor();

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPanPosition = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prevZoom => Math.min(Math.max(prevZoom * delta, 0.1), 4));
    } else if (editorMode === 'pan') {
      event.preventDefault();
      setPanPosition(prev => ({
        x: prev.x - event.deltaX / zoom,
        y: prev.y - event.deltaY / zoom,
      }));
    }
  }, [editorMode, setPanPosition, zoom, setZoom]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (editorMode === 'pan') {
      isPanning.current = true;
      lastPanPosition.current = { x: event.clientX, y: event.clientY };
    }
  }, [editorMode]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isPanning.current) {
      const deltaX = (event.clientX - lastPanPosition.current.x) / zoom;
      const deltaY = (event.clientY - lastPanPosition.current.y) / zoom;
      setPanPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      lastPanPosition.current = { x: event.clientX, y: event.clientY };
    }
  }, [setPanPosition, zoom]);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseUp]);

  const getViewportSize = () => {
    switch (viewMode) {
      case 'desktop': return { width: '100%', height: '100%' };
      case 'tablet': return { width: '768px', height: '1024px' };
      case 'mobile': return { width: '375px', height: '667px' };
    }
  };

  const canvasStyle = {
    transform: `scale(${zoom}) translate(${panPosition.x}px, ${panPosition.y}px)`,
    transformOrigin: '0 0',
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId('');
    }
  };

  return (
    <div 
      ref={canvasRef}
      className={cn(
        "w-full h-full bg-gray-100 overflow-hidden relative",
        editorMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      )}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0" style={canvasStyle}>
        <div className="mx-auto bg-white shadow-lg" style={getViewportSize()}>
          {components.map(component => (
            <CanvasComponent key={component.id} component={component} />
          ))}
        </div>
      </div>
    </div>
  );
};