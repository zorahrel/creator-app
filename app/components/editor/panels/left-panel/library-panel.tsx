import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { ComponentList } from './component-list';

export const LibraryPanel = () => {
  return (
    <div className="p-2">
      <Input
        placeholder="Search library..."
        className="mb-2"
      />
      <Tabs defaultValue="components">
        <TabsList className="w-full">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <ComponentList />
        </TabsContent>
        
        <TabsContent value="styles">
          {/* Add styles library content */}
        </TabsContent>
        
        <TabsContent value="code">
          {/* Add code snippets content */}
        </TabsContent>
        
        <TabsContent value="assets">
          {/* Add assets library content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 