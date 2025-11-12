import React from 'react'
import { Edit2, Trash2, TrendingUp, Calendar } from 'lucide-react'

function RecordList({ records, onEdit, onDelete }) {
    const getReadingColor = (value) => {
        const num = parseInt(value)
        if (num < 70) return 'text-red-600 bg-red-50'
        if (num <= 140) return 'text-green-600 bg-green-50'
        return 'text-red-600 bg-red-50'
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-3">
            {records.map(record => (
                <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span className="font-semibold text-gray-900">{formatDate(record.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onEdit(record)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    title="Edit"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(record.id)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Readings Grid */}
                    <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {record.beforeBreakfast && (
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">Before Breakfast</p>
                                    <div className={`px-3 py-2 rounded-lg font-semibold ${getReadingColor(record.beforeBreakfast)}`}>
                                        {record.beforeBreakfast}
                                    </div>
                                </div>
                            )}
                            {record.afterBreakfast && (
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">After Breakfast</p>
                                    <div className={`px-3 py-2 rounded-lg font-semibold ${getReadingColor(record.afterBreakfast)}`}>
                                        {record.afterBreakfast}
                                    </div>
                                </div>
                            )}
                            {record.afterLunch && (
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">After Lunch</p>
                                    <div className={`px-3 py-2 rounded-lg font-semibold ${getReadingColor(record.afterLunch)}`}>
                                        {record.afterLunch}
                                    </div>
                                </div>
                            )}
                            {record.afterDinner && (
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">After Dinner</p>
                                    <div className={`px-3 py-2 rounded-lg font-semibold ${getReadingColor(record.afterDinner)}`}>
                                        {record.afterDinner}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Meal Notes */}
                        {(record.breakfastMeal || record.lunchMeal || record.dinnerMeal) && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    {record.breakfastMeal && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Breakfast</p>
                                            <p className="text-gray-900">{record.breakfastMeal}</p>
                                        </div>
                                    )}
                                    {record.lunchMeal && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Lunch</p>
                                            <p className="text-gray-900">{record.lunchMeal}</p>
                                        </div>
                                    )}
                                    {record.dinnerMeal && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Dinner</p>
                                            <p className="text-gray-900">{record.dinnerMeal}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RecordList