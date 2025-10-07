import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={ "258197998165-sp0qhea21q8hrqo3jboikklukgr74jpa.apps.googleusercontent.com"}
      onScriptLoadError={() => console.log('Google OAuth script failed to load')}
    >
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
//process.env.REACT_APP_GOOGLE_CLIENT_ID ||