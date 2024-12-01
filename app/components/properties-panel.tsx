import React, { useState, useRef } from 'react';
import {
  ChevronDown, Copy, Trash, Droplet, PenTool, Zap, MinusSquare,
  ChevronsRight,
  MoreHorizontal,
  Equal,
} from 'lucide-react';
import { Slider } from '~/components/ui/slider';
import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button'
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { IconSelect } from './ui/icon-select';
import { NumberInput } from './ui/number-input';
import { ColorPicker } from './ui/color-picker';
import { BoxShadowPicker } from './ui/box-shadow-picker';
import { IconButton } from './ui/icon-button';
import { CollapsibleSection } from './ui/collapsible-section';
import {
  TbLayoutDistributeHorizontal,
  TbLayoutDistributeVertical,
  TbLayoutNavbar,
  TbArrowAutofitWidth,
  TbArrowAutofitHeight,
} from "react-icons/tb";
import { LayoutSection } from './properties-panel/layout-section';
import { SizeSection } from './properties-panel/size-section';
import { TypographySection } from './properties-panel/typography-section';

// Type definitions
type Component = {
  id: string;
  type: string;
  name: string;
  classes: string[];
  styles: React.CSSProperties;
  children: Component[];
};

const DraggableInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  presets?: { label: string; value: string }[];
}> = ({ value, onChange, min = 0, max = 100, step = 1, unit = 'px', presets = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = (newValue: number[]) => {
    onChange(`${newValue[0]}${unit}`);
  };

  const numericValue = parseFloat(value) || 0;

  return (
    <div className="relative flex items-center space-x-2">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Slider
        value={[numericValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        className="w-24"
      />
      {presets.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onChange(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

interface PropertiesPanelProps {
  selectedComponent: Component;
  updateComponents: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  applyTextFormat: (id: string, format: 'bold' | 'italic' | 'underline' | 'align', value?: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedComponent, 
  updateComponents, 
  deleteComponent,
  applyTextFormat
}) => {
  if (!selectedComponent) return null;

  return (
    <div className="space-y-1">
      {/* Component Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <Select
            value={selectedComponent.type}
            onValueChange={(value) => updateComponents(selectedComponent.id, { type: value })}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="div">Div</SelectItem>
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="button">Button</SelectItem>
              {/* Add more component types as needed */}
            </SelectContent>
          </Select>
          <Input
            value={selectedComponent.name}
            onChange={(e) => updateComponents(selectedComponent.id, { name: e.target.value })}
            className="w-[120px] h-8"
          />
        </div>
        <div className="flex space-x-1">
          <IconButton icon={<Copy size={14} />} tooltip="Duplicate" onClick={() => {/* Implement duplication */}} />
          <IconButton icon={<Trash size={14} />} tooltip="Delete" onClick={() => deleteComponent(selectedComponent.id)} />
        </div>
      </div>

      {/* Layout Section */}
      <LayoutSection 
        selectedComponent={selectedComponent}
        updateComponents={updateComponents}
      />

      <SizeSection 
        selectedComponent={selectedComponent}
        updateComponents={updateComponents}
      />

      <TypographySection
        selectedComponent={selectedComponent}
        updateComponents={updateComponents}
        applyTextFormat={applyTextFormat}
      />

      <CollapsibleSection title="Fill" icon={<Droplet size={14} />}>
        <ColorPicker
          color={selectedComponent.styles.backgroundColor || '#ffffff'}
          onChange={(color) => updateComponents(selectedComponent.id, {
            styles: { ...selectedComponent.styles, backgroundColor: color }
          })}
        />
        <NumberInput
          label="Opacity"
          value={selectedComponent.styles.opacity || '1'}
          onChange={(value) => updateComponents(selectedComponent.id, {
            styles: { ...selectedComponent.styles, opacity: value }
          })}
          min={0}
          max={1}
          step={0.01}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Border" icon={<PenTool size={14} />}>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Width"
            value={selectedComponent.styles.borderWidth}
            onChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, borderWidth: value }
            })}
            min={0}
            max={20}
            step={1}
            unit="px"
          />
          <IconSelect
            value={selectedComponent.styles.borderStyle || 'solid'}
            onChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, borderStyle: value }
            })}
            options={[
              { value: 'solid', icon: <MinusSquare size={12} /> },
              { value: 'dashed', icon: <ChevronsRight size={12} /> },
              { value: 'dotted', icon: <MoreHorizontal size={12} /> },
              { value: 'double', icon: <Equal size={12} /> },
            ]}
          />
        </div>
        <ColorPicker
          color={selectedComponent.styles.borderColor || '#000000'}
          onChange={(color) => updateComponents(selectedComponent.id, {
            styles: { ...selectedComponent.styles, borderColor: color }
          })}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Effects" icon={<Zap size={14} />}>
        <BoxShadowPicker
          value={selectedComponent.styles.boxShadow}
          onChange={(value) => updateComponents(selectedComponent.id, {
            styles: { ...selectedComponent.styles, boxShadow: value }
          })}
        />
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            checked={selectedComponent.styles.transition !== undefined}
            onCheckedChange={(checked) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, transition: checked ? 'all 0.3s ease' : undefined }
            })}
          />
          <Label className="text-xs">Enable Transition</Label>
        </div>
      </CollapsibleSection>
    </div>
  );
};
export default PropertiesPanel;

