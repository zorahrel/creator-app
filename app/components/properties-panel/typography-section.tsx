import React from 'react';
import { Type, BoldIcon, ItalicIcon, UnderlineIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon } from 'lucide-react';
import { IconSelect } from '~/components/ui/icon-select';
import { NumberInput } from '~/components/ui/number-input';
import { IconToggle } from '~/components/ui/icon-toggle';
import { CollapsibleSection } from '~/components/ui/collapsible-section';
import { ControlRow } from '~/components/ui/control-row';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface Component {
  id: string;
  styles: React.CSSProperties;
}

interface TypographySectionProps {
  selectedComponent: Component;
  updateComponents: (id: string, updates: Partial<Component>) => void;
  applyTextFormat: (id: string, format: 'bold' | 'italic' | 'underline' | 'align', value?: string) => void;
}

const fontFamilyOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'helvetica', label: 'Helvetica' },
  { value: 'arial', label: 'Arial' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'monospace', label: 'Monospace' },
] as const;

const fontWeightOptions = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extrabold' },
] as const;

export const TypographySection: React.FC<TypographySectionProps> = ({
  selectedComponent,
  updateComponents,
  applyTextFormat
}) => {
  return (
    <CollapsibleSection title="Typography" icon={<Type size={14} />}>
      <div className="space-y-2">
        <ControlRow label="Font">
          <Select
            value={selectedComponent.styles.fontFamily || 'inter'}
            onValueChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, fontFamily: value }
            })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilyOptions.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  style={{ fontFamily: option.value }}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlRow>

        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Size"
            value={selectedComponent.styles.fontSize}
            onChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, fontSize: value }
            })}
            min={8}
            max={200}
            step={1}
            unit="px"
          />

          <Select
            value={selectedComponent.styles.fontWeight?.toString() || '400'}
            onValueChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, fontWeight: value }
            })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Weight" />
            </SelectTrigger>
            <SelectContent>
              {fontWeightOptions.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  style={{ fontWeight: option.value }}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <NumberInput
          label="Line Height"
          value={selectedComponent.styles.lineHeight}
          onChange={(value) => updateComponents(selectedComponent.id, {
            styles: { ...selectedComponent.styles, lineHeight: value }
          })}
          min={0.5}
          max={3}
          step={0.1}
          unit="x"
        />

        <ControlRow label="Style">
          <div className="flex space-x-1">
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
        </ControlRow>

        <ControlRow label="Align">
          <div className="flex space-x-1">
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
        </ControlRow>
      </div>
    </CollapsibleSection>
  );
}; 