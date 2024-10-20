import React from 'react';
import { NumberInput } from './number-input';

interface FourSidesInputProps {
  values: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };
  onChange: (side: 'top' | 'right' | 'bottom' | 'left', value: string) => void;
}

export const FourSidesInput: React.FC<FourSidesInputProps> = ({ values, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NumberInput
        label="T"
        value={values.top || ''}
        onChange={(value) => onChange('top', value)}
        min={0}
        step={1}
      />
      <NumberInput
        label="R"
        value={values.right || ''}
        onChange={(value) => onChange('right', value)}
        min={0}
        step={1}
      />
      <NumberInput
        label="B"
        value={values.bottom || ''}
        onChange={(value) => onChange('bottom', value)}
        min={0}
        step={1}
      />
      <NumberInput
        label="L"
        value={values.left || ''}
        onChange={(value) => onChange('left', value)}
        min={0}
        step={1}
      />
    </div>
  );
};
