import React from 'react';
import ReactDOM from 'react-dom';
import { Amplify } from 'aws-amplify';
import './index.css';
import App from './App';

import outputs from './amplify_outputs.json';
if (outputs.auth?.user_pool_id && !outputs.auth.user_pool_id.includes('PLACEHOLDER')) {
  Amplify.configure(outputs);
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
