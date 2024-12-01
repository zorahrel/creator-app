import React, { useState } from 'react';
import { Move, Lock, Unlock, ArrowDownUp, ArrowRightLeft } from 'lucide-react';
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { TbX } from 'react-icons/tb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { CollapsibleSection } from '~/components/ui/collapsible-section';
import { ControlRow } from '~/components/ui/control-row';

interface Component {
  id: string;
  styles: React.CSSProperties & {
    minWidth?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: string | number;
  };
}

interface SizeSectionProps {
  selectedComponent: Component;
  updateComponents: (id: string, updates: Partial<Component>) => void;
}

const sizeOptions = [
  { value: 'fixed', label: 'Fixed', unit: 'px' },
  { value: 'fill', label: 'Fill', unit: '1fr' },
  { value: 'fit', label: 'Fit', unit: 'fit-content' },
  { value: 'relative', label: 'Relative', unit: '%' }
] as const;

type MinMaxField = 'minWidth' | 'maxWidth' | 'minHeight' | 'maxHeight';

const formatLabel = (field: MinMaxField) => {
  const parts = field.split(/(?=[A-Z])/);
  return parts.map((part, i) => 
    i === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part
  ).join(' ');
};

export const SizeSection: React.FC<SizeSectionProps> = ({ selectedComponent, updateComponents }) => {
  const [lockDimensions, setLockDimensions] = useState(false);
  const [activeMinMaxFields, setActiveMinMaxFields] = useState<MinMaxField[]>([]);

  const getSizeOption = (value: string | number | undefined) => {
    if (!value) return 'fill';
    if (typeof value === 'number' || value.endsWith('px')) return 'fixed';
    if (value.endsWith('fr')) return 'fill';
    if (value === 'fit-content') return 'fit';
    if (value.endsWith('%')) return 'relative';
    return 'fill';
  };

  const getSizeValue = (value: string | number | undefined) => {
    if (!value) return '';
    if (typeof value === 'number') return value.toString();
    if (value.endsWith('px')) return value.replace('px', '');
    if (value.endsWith('fr')) return value.replace('fr', '');
    if (value === 'fit-content') return '';
    if (value.endsWith('%')) return value.replace('%', '');
    return value;
  };

  const updateDimension = (dimension: 'width' | 'height', value: string, unit: string) => {
    const newValue = value ? `${value}${unit}` : '1fr';
    updateComponents(selectedComponent.id, {
      styles: {
        ...selectedComponent.styles,
        [dimension]: newValue,
        ...(lockDimensions ? {
          [dimension === 'width' ? 'height' : 'width']: newValue
        } : {})
      }
    });
  };

  const updateMinMax = (property: 'minWidth' | 'maxWidth' | 'minHeight' | 'maxHeight', value: string) => {
    updateComponents(selectedComponent.id, {
      styles: {
        ...selectedComponent.styles,
        [property]: value
      }
    });
  };

  const getAvailableMinMaxFields = () => {
    const allFields: MinMaxField[] = ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
    return allFields.filter(field => !activeMinMaxFields.includes(field));
  };

  return (
    <CollapsibleSection title="Size" icon={<Move size={14} />}>
      <div className="space-y-2">
        <div className="relative space-y-2">
          <ControlRow label="Width">
            <div className="flex items-center gap-2">
              <Input
                value={getSizeValue(selectedComponent.styles.width)}
                onChange={(e) => {
                  const option = sizeOptions.find(opt =>
                    opt.value === getSizeOption(selectedComponent.styles.width)
                  );
                  updateDimension('width', e.target.value, option?.unit || 'px');
                }}
                className="w-20"
                type="number"
                disabled={getSizeOption(selectedComponent.styles.width) === 'fit'}
              />
              <Select
                value={getSizeOption(selectedComponent.styles.width)}
                onValueChange={(value) => {
                  const option = sizeOptions.find(opt => opt.value === value);
                  if (option) {
                    const sizeValue = value === 'fit' ? '' : '1';
                    updateDimension('width', sizeValue, option.unit);
                  }
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ControlRow>

          <div className="absolute left-12 top-[40%] -translate-y-1/2 flex flex-col items-center">
          <svg width="20" height="14" className="">
              <path
                d="M 10 14 L 10 7 C 10 0 20 0 20 0"
                stroke="hsl(var(--border))"
                fill="none"
              />
            </svg>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLockDimensions(!lockDimensions)}
              className="h-6 w-6 relative z-10 bg-background"
            >
              {lockDimensions ? <Lock size={12} /> : <Unlock size={12} />}
            </Button>
            <svg width="20" height="14" className="">
              <path
                d="M 10 0 L 10 7 C 10 14 20 14 20 14"
                stroke="hsl(var(--border))"
                fill="none"
              />
            </svg>
          </div>

          <ControlRow label="Height">
            <div className="flex items-center gap-2">
              <Input
                value={getSizeValue(selectedComponent.styles.height)}
                onChange={(e) => {
                  const option = sizeOptions.find(opt =>
                    opt.value === getSizeOption(selectedComponent.styles.height)
                  );
                  updateDimension('height', e.target.value, option?.unit || 'px');
                }}
                className="w-20"
                type="number"
                disabled={getSizeOption(selectedComponent.styles.height) === 'fit'}
              />
              <Select
                value={getSizeOption(selectedComponent.styles.height)}
                onValueChange={(value) => {
                  const option = sizeOptions.find(opt => opt.value === value);
                  if (option) {
                    const sizeValue = value === 'fit' ? '' : '1';
                    updateDimension('height', sizeValue, option.unit);
                  }
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ControlRow>
        </div>

        {activeMinMaxFields.map((field) => (
          <ControlRow key={field} label={formatLabel(field)}>
            <div className="flex items-center gap-2">
              <Input
                value={selectedComponent.styles[field] || (field.includes('max') ? 'none' : '0')}
                onChange={(e) => updateMinMax(field, e.target.value)}
                className="w-20"
              />
              {field.includes('Width') ? (
                <ArrowRightLeft size={14} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={14} className="text-muted-foreground" />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveMinMaxFields(prev => prev.filter(f => f !== field))}
                className="ml-auto h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
              >
                <TbX size={12} />
              </Button>
            </div>
          </ControlRow>
        ))}

        {getAvailableMinMaxFields().length > 0 && (
          <ControlRow label="Min Max">
            <Select
              onValueChange={(value: MinMaxField) => {
                setActiveMinMaxFields(prev => [...prev, value]);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add min/max constraint..." />
              </SelectTrigger>
              <SelectContent>
                {getAvailableMinMaxFields().map(field => (
                  <SelectItem key={field} value={field}>
                    {formatLabel(field)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ControlRow>
        )}
      </div>
    </CollapsibleSection>
  );
};