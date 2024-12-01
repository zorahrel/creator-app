import React from 'react';
import { EditorProvider } from '~/contexts/editor-context';
import { EditorLayout } from './layout';

const Editor: React.FC = () => {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
};

export default Editor;