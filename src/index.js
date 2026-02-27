import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import './index.css';
import App from './App';

import outputs from './amplify_outputs.json';
if (outputs.auth?.user_pool_id && !outputs.auth.user_pool_id.includes('PLACEHOLDER')) {
  Amplify.configure(outputs);
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
