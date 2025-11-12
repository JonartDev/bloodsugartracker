import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';
import { AlertProvider } from './context/AlertContext';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <AlertProvider>
                <App />
            </AlertProvider>
        </UserProvider>
    </React.StrictMode>
);