import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// eslint-disable-next-line no-console
console.log('Clerk publishable key loaded:', publishableKey ? 'Yes' : 'No');
// eslint-disable-next-line no-console
console.log('Key value:', publishableKey);

if (!publishableKey) {
  // eslint-disable-next-line no-console
  console.error('Missing REACT_APP_CLERK_PUBLISHABLE_KEY. Set it in your environment.');
  // eslint-disable-next-line no-console
  console.log('Please create a .env file with: REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here');
}

// Fallback component in case Clerk fails
const AppWithFallback = () => {
  try {
    return (
      <ClerkProvider publishableKey={publishableKey || 'pk_test_placeholder'}>
        <App />
      </ClerkProvider>
    );
  } catch (error) {
    console.error('Clerk initialization error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Manufacturing Traceback System</h1>
        <p>Please set up your Clerk publishable key in the .env file</p>
        <p>Create a .env file with: REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here</p>
      </div>
    );
  }
};

root.render(
  <React.StrictMode>
    <AppWithFallback />
  </React.StrictMode>
);