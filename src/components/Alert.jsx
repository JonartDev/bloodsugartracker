import { React, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const Alert = ({ message, type = 'success', onClose }) => {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertTriangle,
        info: Info
    }

    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    }

    const Icon = icons[type]

    return (
        <div className={`flex items-center p-4 rounded-lg border shadow-lg ${styles[type]} animate-in slide-in-from-top-1 duration-300`}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="ml-3 flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

export default Alert