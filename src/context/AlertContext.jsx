import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = 'success', duration = 3000) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), duration);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export { AlertContext };