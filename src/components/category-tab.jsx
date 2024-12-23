import React from 'react';
import { Button } from 'antd';

export default function CategoryTab({ text, selected = false, onClick }) {
  return (
    <div>
      <Button {...(selected ? { type: 'primary' } : {})} onClick={onClick}>
        {text}
      </Button>
    </div>
  );
}
