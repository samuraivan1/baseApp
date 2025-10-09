// src/pages/Unauthorized/index.tsx
import React from 'react';
import { unauthorizedText } from './Unauthorized.messages';

const Unauthorized: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>{unauthorizedText.title}</h1>
      <p>{unauthorizedText.description}</p>
      <a href="/home">{unauthorizedText.backHome}</a>
    </div>
  );
};

export default Unauthorized;
