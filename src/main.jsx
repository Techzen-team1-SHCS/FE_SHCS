import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="258197998165-sp0qhea21q8hrqo3jboikklukgr74jpa.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
