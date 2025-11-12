import React from 'react'
import RecordForm from './RecordForm'
import { X } from 'lucide-react'

export default function RecordModal({ onClose, onAdd, onUpdate, editing }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {editing ? 'Edit Reading' : 'Add New Reading'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="p-6">
                        <RecordForm
                            initial={editing}
                            onCancel={onClose}
                            onAdd={onAdd}
                            onUpdate={onUpdate}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}