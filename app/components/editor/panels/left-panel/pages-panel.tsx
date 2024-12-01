import React from 'react';
import { Button } from "~/components/ui/button";
import { Plus } from 'lucide-react';
import { Input } from "~/components/ui/input";

export const PagesPanel = () => {
  return (
    <div className="p-2 space-y-2">
      <Input
        placeholder="Search pages..."
        className="mb-2"
      />
      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start">
          Home
        </Button>
        {/* Add more pages here */}
      </div>
      <Button variant="ghost" className="w-full justify-start gap-2">
        <Plus className="h-4 w-4" />
        Add Page
      </Button>
    </div>
  );
}; 