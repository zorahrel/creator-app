import React, { useState, useMemo } from 'react';
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Input } from "~/components/ui/input";
import { useEditor } from '~/contexts/editor-context';
import { componentTypes } from '~/constants/component-types';
import { Plus, Search, X } from 'lucide-react';
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

// Component categories
const categories = {
  layout: ['div'],
  typography: ['p', 'h1', 'h2', 'h3'],
  forms: ['button', 'input', 'textarea'],
  media: ['img'],
  navigation: ['a', 'ul', 'ol'],
};

export const ComponentList = () => {
  const { selectedId, addComponent } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = useMemo(() => {
    if (!searchQuery) return componentTypes;
    
    return componentTypes.filter(component => 
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const groupedComponents = useMemo(() => {
    const grouped: Record<string, typeof componentTypes> = {
      layout: [],
      typography: [],
      forms: [],
      media: [],
      navigation: [],
      other: [],
    };

    filteredComponents.forEach(component => {
      let categorized = false;
      for (const [category, types] of Object.entries(categories)) {
        if (types.includes(component.type)) {
          grouped[category].push(component);
          categorized = true;
          break;
        }
      }
      if (!categorized) {
        grouped.other.push(component);
      }
    });

    return grouped;
  }, [filteredComponents]);

  return (
    <>
      {isOpen && (
        <div className="absolute inset-0 bg-background z-10">
          <div className="flex flex-col h-full">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3">
                {Object.entries(groupedComponents).map(([category, components]) => {
                  if (components.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-4 last:mb-0">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase">
                        {category}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {components.map(({ type, name, icon }) => (
                          <TooltipProvider key={type}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-24 w-full p-2 flex flex-col items-center justify-center text-xs"
                                  onClick={() => {
                                    addComponent(selectedId, {
                                      type,
                                      name: `New ${name}`,
                                      isTextComponent: ['p', 'h1', 'h2', 'h3', 'button', 'a'].includes(type)
                                    });
                                    setIsOpen(false);
                                  }}
                                >
                                  {React.cloneElement(icon, { className: "h-10 w-10 mb-2" })}
                                  <span className="truncate w-full">{name}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{name}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                      <Separator className="my-4 last:hidden" />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 border-t bg-background">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center gap-2 h-12"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Component
        </Button>
      </div>
    </>
  );
};