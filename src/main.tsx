import React from 'react';
import ReactDOM from 'react-dom/client';
import UDLPChatInterface from './UDLPChatInterface';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <UDLPChatInterface />
  </React.StrictMode>
);
