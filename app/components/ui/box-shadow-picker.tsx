import React, { useState } from 'react';
import { NumberInput } from './number-input';
import { ColorPicker } from './color-picker';

interface BoxShadowPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const BoxShadowPicker: React.FC<BoxShadowPickerProps> = ({ value, onChange }) => {
  const [shadow, setShadow] = useState(() => {
    if (!value) {
      return { x: 0, y: 0, blur: 0, spread: 0, color: '#000000' };
    }
    const parts = value.split(' ');
    return {
      x: parseInt(parts[0]) || 0,
      y: parseInt(parts[1]) || 0,
      blur: parseInt(parts[2]) || 0,
      spread: parseInt(parts[3]) || 0,
      color: parts[4] || '#000000',
    };
  });

  const updateShadow = (key: keyof typeof shadow, newValue: number | string) => {
    const newShadow = { ...shadow, [key]: newValue };
    setShadow(newShadow);
    onChange(`${newShadow.x}px ${newShadow.y}px ${newShadow.blur}px ${newShadow.spread}px ${newShadow.color}`);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <NumberInput label="X" value={shadow.x} onChange={(value) => updateShadow('x', parseInt(value))} />
        <NumberInput label="Y" value={shadow.y} onChange={(value) => updateShadow('y', parseInt(value))} />
        <NumberInput label="Blur" value={shadow.blur} onChange={(value) => updateShadow('blur', parseInt(value))} />
        <NumberInput label="Spread" value={shadow.spread} onChange={(value) => updateShadow('spread', parseInt(value))} />
      </div>
      <ColorPicker color={shadow.color} onChange={(color) => updateShadow('color', color)} />
    </div>
  );
};
