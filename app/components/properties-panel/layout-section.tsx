import React from 'react';
import {
  TbLayout,
  TbBox,
  TbArrowAutofitWidth,
  TbArrowAutofitHeight,
  TbLayoutAlignLeft,
  TbLayoutAlignCenter,
  TbLayoutAlignRight,
  TbLayoutDistributeHorizontal,
  TbArrowAutofitContent,
  TbLayoutGrid,
  TbSpacingHorizontal,
  TbBoxAlignRightFilled,
  TbGridDots,
  TbLayoutAlignTop,
  TbLayoutAlignMiddle,
  TbLayoutAlignBottom,
  TbLayoutDistributeVertical,
} from "react-icons/tb";

import { IconButtonGroup } from '../ui/icon-button-group';
import { NumberInput } from '../ui/number-input';
import { CollapsibleSection } from '../ui/collapsible-section';
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { ControlRow } from '~/components/ui/control-row';

interface Component {
  id: string;
  styles: React.CSSProperties & {
    advancedPadding?: boolean;
    gap?: number | string;
    gridTemplateColumns?: string;
    padding?: number | string;
    paddingTop?: number | string;
    paddingRight?: number | string;
    paddingBottom?: number | string;
    paddingLeft?: number | string;
  };
}

interface LayoutSectionProps {
  selectedComponent: Component;
  updateComponents: (id: string, updates: Partial<Component>) => void;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({ selectedComponent, updateComponents }) => (
  <CollapsibleSection title="Layout" icon={<TbLayout size={12} />}>
    <div className="space-y-2">
      <ControlRow label="Display">
        <IconButtonGroup
          value={selectedComponent.styles.display || 'inline-flex'}
          onChange={(value) => updateComponents(selectedComponent.id, {
            styles: { ...selectedComponent.styles, display: value }
          })}
          options={[
            { 
              value: 'inline-flex', 
              icon: <TbBoxAlignRightFilled size={12} />, 
              tooltip: 'Stack',
              label: 'Stack'
            },
            { 
              value: 'grid', 
              icon: <TbGridDots size={12} />, 
              tooltip: 'Grid',
              label: 'Grid'
            },
          ]}
          className="text-muted-foreground"
          showLabels={true}
        />
      </ControlRow>

      <ControlRow label="Spacing">
        <div className="flex items-center gap-2">
          <NumberInput
            label="Gap"
            value={typeof selectedComponent.styles.gap === 'number' ? selectedComponent.styles.gap : 0}
            onChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, gap: value }
            })}
            min={0}
            max={100}
            className="flex-[2]"
          />
          <Slider
            value={[typeof selectedComponent.styles.gap === 'number' ? selectedComponent.styles.gap : 0]}
            onValueChange={([value]) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, gap: value }
            })}
            min={0}
            max={100}
            className="h-4 flex-1"
          />
        </div>
      </ControlRow>

      {/* Stack controls */}
      {selectedComponent.styles.display === 'inline-flex' && (
        <>
          <ControlRow label="Direction">
            <IconButtonGroup
              value={selectedComponent.styles.flexDirection || 'row'}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, flexDirection: value }
              })}
              options={[
                { value: 'row', icon: <TbArrowAutofitWidth size={12} />, tooltip: 'Horizontal' },
                { value: 'column', icon: <TbArrowAutofitHeight size={12} />, tooltip: 'Vertical' },
              ]}
              className="text-muted-foreground"
            />
          </ControlRow>

          <ControlRow label="Distribution">
            <IconButtonGroup
              value={selectedComponent.styles.justifyContent || 'flex-start'}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, justifyContent: value }
              })}
              options={[
                { value: 'flex-start', icon: <TbLayoutAlignLeft size={12} />, tooltip: 'Start' },
                { value: 'center', icon: <TbLayoutAlignCenter size={12} />, tooltip: 'Center' },
                { value: 'flex-end', icon: <TbLayoutAlignRight size={12} />, tooltip: 'End' },
                { value: 'space-between', icon: <TbLayoutDistributeVertical size={12} />, tooltip: 'Space Between' },
                { value: 'space-around', icon: <TbLayoutDistributeHorizontal size={12} />, tooltip: 'Space Around' },
                { value: 'space-evenly', icon: <TbLayoutDistributeHorizontal size={12} />, tooltip: 'Space Evenly' },
              ]}
              className="text-muted-foreground"
            />
          </ControlRow>

          <ControlRow label="Align">
            <IconButtonGroup
              value={selectedComponent.styles.alignItems || 'flex-start'}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: { ...selectedComponent.styles, alignItems: value }
              })}
              options={[
                { value: 'flex-start', icon: <TbLayoutAlignTop size={12} />, tooltip: 'Start' },
                { value: 'center', icon: <TbLayoutAlignMiddle size={12} />, tooltip: 'Center' },
                { value: 'flex-end', icon: <TbLayoutAlignBottom size={12} />, tooltip: 'End' },
              ]}
              className="text-muted-foreground"
            />
          </ControlRow>
        </>
      )}

      {/* Grid controls */}
      {selectedComponent.styles.display === 'grid' && (
        <ControlRow label="Columns">
          <NumberInput
            value={selectedComponent.styles.gridTemplateColumns?.toString().split(' ').length || 1}
            onChange={(value) => updateComponents(selectedComponent.id, {
              styles: { ...selectedComponent.styles, gridTemplateColumns: `repeat(${value}, 1fr)` }
            })}
            min={1}
            max={12}
          />
        </ControlRow>
      )}

      <ControlRow label="Padding">
        <div className="flex items-center gap-2 w-full">
          {selectedComponent.styles.advancedPadding ? (
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-1">
              {/* Left column */}
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">L</span>
                  <NumberInput
                    value={selectedComponent.styles.paddingLeft}
                    onChange={(value) => updateComponents(selectedComponent.id, {
                      styles: { ...selectedComponent.styles, paddingLeft: value }
                    })}
                    min={0}
                    max={100}
                    className="w-8"
                    hideArrows
                  />
                </div>
              </div>
              {/* Middle column (Top and Bottom) */}
              <div className="flex flex-col gap-2 items-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">T</span>
                  <NumberInput
                    value={selectedComponent.styles.paddingTop}
                    onChange={(value) => updateComponents(selectedComponent.id, {
                      styles: { ...selectedComponent.styles, paddingTop: value }
                    })}
                    min={0}
                    max={100}
                    className="w-8 flex-shrink-0"
                    hideArrows
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <NumberInput
                    value={selectedComponent.styles.paddingBottom}
                    onChange={(value) => updateComponents(selectedComponent.id, {
                      styles: { ...selectedComponent.styles, paddingBottom: value }
                    })}
                    min={0}
                    max={100}
                    className="w-8"
                    hideArrows
                  />
                  <span className="text-xs text-muted-foreground">B</span>
                </div>
              </div>
              {/* Right column */}
              <div className="flex items-center justify-start">
                <div className="flex items-center gap-1">
                  <NumberInput
                    value={selectedComponent.styles.paddingRight}
                    onChange={(value) => updateComponents(selectedComponent.id, {
                      styles: { ...selectedComponent.styles, paddingRight: value }
                    })}
                    min={0}
                    max={100}
                    className="w-8"
                    hideArrows
                  />
                  <span className="text-xs text-muted-foreground">R</span>
                </div>
              </div>
            </div>
          ) : (
            <NumberInput
              value={selectedComponent.styles.padding || 0}
              onChange={(value) => updateComponents(selectedComponent.id, {
                styles: {
                  ...selectedComponent.styles,
                  padding: value,
                  paddingTop: undefined,
                  paddingRight: undefined,
                  paddingBottom: undefined,
                  paddingLeft: undefined,
                }
              })}
              min={0}
              max={100}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="px-2 flex-shrink-0"
            onClick={() => {
              if (selectedComponent.styles.advancedPadding) {
                updateComponents(selectedComponent.id, {
                  styles: {
                    ...selectedComponent.styles,
                    advancedPadding: false,
                    padding: selectedComponent.styles.paddingTop || 0,
                    paddingTop: undefined,
                    paddingRight: undefined,
                    paddingBottom: undefined,
                    paddingLeft: undefined,
                  }
                });
              } else {
                updateComponents(selectedComponent.id, {
                  styles: {
                    ...selectedComponent.styles,
                    advancedPadding: true,
                    paddingTop: selectedComponent.styles.padding || 0,
                    paddingRight: selectedComponent.styles.padding || 0,
                    paddingBottom: selectedComponent.styles.padding || 0,
                    paddingLeft: selectedComponent.styles.padding || 0,
                    padding: undefined,
                  }
                });
              }
            }}
          >
            {selectedComponent.styles.advancedPadding ? (
              <TbBox size={14} />
            ) : (
              <TbArrowAutofitContent size={14} />
            )}
          </Button>
        </div>
      </ControlRow>
    </div>
  </CollapsibleSection>
); 