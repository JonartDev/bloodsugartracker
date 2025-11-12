import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const Alert = ({ message, type = 'success', onClose }) => {
    console.log('Alert component rendering:', message, type);

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertTriangle,
        info: Info
    }

    const styles = {
        success: 'bg-green-50 border-2 border-green-200 text-green-800',
        error: 'bg-red-50 border-2 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-2 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-2 border-blue-200 text-blue-800'
    }

    const Icon = icons[type]

    useEffect(() => {
        if (message) {
            console.log('Alert mounted with message:', message);
            const timer = setTimeout(() => {
                console.log('Auto-closing alert');
                onClose();
            }, 5000);

            return () => {
                console.log('Cleaning up alert timer');
                clearTimeout(timer);
            };
        }
    }, [message, onClose]);

    if (!message) {
        console.log('No message, returning null');
        return null;
    }

    return (
        <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${styles[type]} animate-in slide-in-from-top-1 duration-300`}
            style={{ zIndex: 9999 }}
            role="alert"
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="ml-3 flex-1 text-sm font-medium pr-2">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity p-1 rounded"
                aria-label="Close alert"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

export default Alert