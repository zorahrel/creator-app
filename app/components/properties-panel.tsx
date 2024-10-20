import React, { useState, useRef } from 'react';
import {
  ChevronDown, ChevronRight, Copy, Trash,
  Box, Layout, Move, Type, Droplet, PenTool, Zap, ArrowUpToLine, BoldIcon, ItalicIcon, UnderlineIcon,
  Layers, LayoutGrid, LayoutList,
  MousePointer, Maximize2, MinusSquare,
  AlignStartHorizontal, AlignEndHorizontal, AlignCenterHorizontal,
  AlignStartVertical, AlignEndVertical, AlignCenterVertical,
  PinIcon,
  AlignCenter, AlignLeft, AlignRight, AlignJustify,
  ChevronsRight,
  AlignHorizontalSpaceBetween,
  AlignVerticalSpaceBetween,
  StretchHorizontal,
  StretchVertical,
  ArrowRightLeft, ArrowDownUp,
  MoreHorizontal,
  Equal,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon,
} from 'lucide-react';
import { Slider } from '~/components/ui/slider';
import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button'
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { IconSelect } from './ui/icon-select';
import { NumberInput } from './ui/number-input';
import { IconToggle } from './ui/icon-toggle';
import { ColorPicker } from './ui/color-picker';
import { BoxShadowPicker } from './ui/box-shadow-picker';
import { IconButtonGroup } from './ui/icon-button-group';
import { IconButton } from './ui/icon-button';
import { FourSidesInput } from './ui/four-sides-input';

// Type definitions
type Component = {
  id: string;
  type: string;
  name: string;
  classes: string[];
  styles: React.CSSProperties;
  children: Component[];
};

// Collapsible Section Component
const CollapsibleSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full text-left py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && (
        <div className="mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
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
  return (
    <div className="p-2 space-y-1 bg-white shadow-lg rounded-lg text-xs">
      {/* Component Header */}
      <div className="flex items-center justify-between mb-2">
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

      <div className="space-y-1">
        <CollapsibleSection title="Layout" icon={<Layout size={14} />}>
          <div className="grid grid-cols-5 gap-1">
            <IconButton
              icon={<Box size={12} />}
              tooltip="Block"
              isActive={selectedComponent.styles.display === 'block'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, display: 'block' }
              })}
            />
            <IconButton
              icon={<LayoutList size={12} />}
              tooltip="Inline Block"
              isActive={selectedComponent.styles.display === 'inline-block'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, display: 'inline-block' }
              })}
            />
            <IconButton
              icon={<Layout size={12} />}
              tooltip="Flex"
              isActive={selectedComponent.styles.display === 'flex'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, display: 'flex' }
              })}
            />
            <IconButton
              icon={<LayoutGrid size={12} />}
              tooltip="Grid"
              isActive={selectedComponent.styles.display === 'grid'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, display: 'grid' }
              })}
            />
            <IconButton
              icon={<Maximize2 size={12} />}
              tooltip="None"
              isActive={selectedComponent.styles.display === 'none'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, display: 'none' }
              })}
            />
          </div>
          <div className="grid grid-cols-5 gap-1 mt-1">
            <IconButton
              icon={<MousePointer size={12} />}
              tooltip="Static"
              isActive={selectedComponent.styles.position === 'static'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, position: 'static' }
              })}
            />
            <IconButton
              icon={<Move size={12} />}
              tooltip="Relative"
              isActive={selectedComponent.styles.position === 'relative'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, position: 'relative' }
              })}
            />
            <IconButton
              icon={<Layers size={12} />}
              tooltip="Absolute"
              isActive={selectedComponent.styles.position === 'absolute'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, position: 'absolute' }
              })}
            />
            <IconButton
              icon={<PinIcon size={12} />}
              tooltip="Fixed"
              isActive={selectedComponent.styles.position === 'fixed'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, position: 'fixed' }
              })}
            />
            <IconButton
              icon={<ArrowUpToLine size={12} />}
              tooltip="Sticky"
              isActive={selectedComponent.styles.position === 'sticky'}
              onClick={() => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, position: 'sticky' }
              })}
            />
          </div>
          <NumberInput
            label="Z"
            value={selectedComponent.styles.zIndex}
            onChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, zIndex: value }
            })}
            min={0}
            max={9999}
            step={1}
          />
          {(selectedComponent.styles.display === 'flex' || selectedComponent.styles.display === 'inline-flex') && (
            <div className="mt-2 space-y-2">
              <IconButtonGroup
                value={selectedComponent.styles.flexDirection || 'row'}
                onChange={(value) => updateComponents(selectedComponent.id, {
                  styles: { ...selectedComponent.styles, flexDirection: value }
                })}
                options={[
                  { value: 'row', icon: <ArrowRightLeft size={12} /> },
                  { value: 'column', icon: <ArrowDownUp size={12} /> },
                  { value: 'row-reverse', icon: <ArrowRightLeft size={12} className="transform rotate-180" /> },
                  { value: 'column-reverse', icon: <ArrowDownUp size={12} className="transform rotate-180" /> },
                ]}
              />
              <IconButtonGroup
                value={selectedComponent.styles.justifyContent || 'flex-start'}
                onChange={(value) => updateComponents(selectedComponent.id, {
                  styles: { ...selectedComponent.styles, justifyContent: value }
                })}
                options={[
                  { value: 'flex-start', icon: <AlignStartHorizontal size={12} /> },
                  { value: 'center', icon: <AlignCenterHorizontal size={12} /> },
                  { value: 'flex-end', icon: <AlignEndHorizontal size={12} /> },
                  { value: 'space-between', icon: <AlignHorizontalSpaceBetween size={12} /> },
                  { value: 'space-around', icon: <StretchHorizontal size={12} /> },
                ]}
              />
              <IconButtonGroup
                value={selectedComponent.styles.alignItems || 'stretch'}
                onChange={(value) => updateComponents(selectedComponent.id, {
                  styles: { ...selectedComponent.styles, alignItems: value }
                })}
                options={[
                  { value: 'flex-start', icon: <AlignStartVertical size={12} /> },
                  { value: 'center', icon: <AlignCenterVertical size={12} /> },
                  { value: 'flex-end', icon: <AlignEndVertical size={12} /> },
                  { value: 'stretch', icon: <StretchVertical size={12} /> },
                  { value: 'baseline', icon: <AlignVerticalSpaceBetween size={12} /> },
                ]}
              />
            </div>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Size" icon={<Move size={14} />}>
          <div className="grid grid-cols-4 gap-1">
            <NumberInput
              label="W"
              value={selectedComponent.styles.width}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, width: value }
              })}
              min={0}
              max={1000}
              step={1}
            />
            <NumberInput
              label="H"
              value={selectedComponent.styles.height}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, height: value }
              })}
              min={0}
              max={1000}
              step={1}
            />
            <NumberInput
              label="Min W"
              value={selectedComponent.styles.minWidth}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, minWidth: value }
              })}
              min={0}
              max={1000}
              step={1}
            />
            <NumberInput
              label="Min H"
              value={selectedComponent.styles.minHeight}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, minHeight: value }
              })}
              min={0}
              max={1000}
              step={1}
            />
          </div>
          <FourSidesInput
            values={{
              top: selectedComponent.styles.top,
              right: selectedComponent.styles.right,
              bottom: selectedComponent.styles.bottom,
              left: selectedComponent.styles.left,
            }}
            onChange={(side, value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, [side]: value }
            })}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Typography" icon={<Type size={14} />}>
          <div className="grid grid-cols-2 gap-2">
            <IconSelect
              value={selectedComponent.styles.fontFamily || 'sans-serif'}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, fontFamily: value }
              })}
              options={[
                { value: 'sans-serif', label: 'Sans' },
                { value: 'serif', label: 'Serif' },
                { value: 'monospace', label: 'Mono' },
              ]}
            />
            <NumberInput
              label="Size"
              value={selectedComponent.styles.fontSize}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, fontSize: value }
              })}
              min={8}
              max={72}
              step={1}
              unit="px"
            />
          </div>
          <div className="flex space-x-2">
            <IconToggle
              icon={<BoldIcon size={12} />}
              isActive={selectedComponent.styles.fontWeight === 'bold'}
              onClick={() => applyTextFormat(selectedComponent.id, 'bold')}
              tooltip="Bold"
            />
            <IconToggle
              icon={<ItalicIcon size={12} />}
              isActive={selectedComponent.styles.fontStyle === 'italic'}
              onClick={() => applyTextFormat(selectedComponent.id, 'italic')}
              tooltip="Italic"
            />
            <IconToggle
              icon={<UnderlineIcon size={12} />}
              isActive={selectedComponent.styles.textDecoration === 'underline'}
              onClick={() => applyTextFormat(selectedComponent.id, 'underline')}
              tooltip="Underline"
            />
          </div>
          <div className="flex space-x-2 mt-2">
            <IconToggle
              icon={<AlignLeftIcon size={12} />}
              isActive={selectedComponent.styles.textAlign === 'left'}
              onClick={() => applyTextFormat(selectedComponent.id, 'align', 'left')}
              tooltip="Align Left"
            />
            <IconToggle
              icon={<AlignCenterIcon size={12} />}
              isActive={selectedComponent.styles.textAlign === 'center'}
              onClick={() => applyTextFormat(selectedComponent.id, 'align', 'center')}
              tooltip="Align Center"
            />
            <IconToggle
              icon={<AlignRightIcon size={12} />}
              isActive={selectedComponent.styles.textAlign === 'right'}
              onClick={() => applyTextFormat(selectedComponent.id, 'align', 'right')}
              tooltip="Align Right"
            />
            <IconToggle
              icon={<AlignJustifyIcon size={12} />}
              isActive={selectedComponent.styles.textAlign === 'justify'}
              onClick={() => applyTextFormat(selectedComponent.id, 'align', 'justify')}
              tooltip="Justify"
            />
          </div>
        </CollapsibleSection>

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
    </div>
  );
};

export default PropertiesPanel;
