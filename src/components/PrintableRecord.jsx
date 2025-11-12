import React from 'react'

const PrintableRecord = ({ record, user }) => {
    const getReadingStatus = (value) => {
        if (!value) return 'text-gray-600'
        const num = parseInt(value)
        if (num < 70) return 'text-red-600 font-bold'
        if (num <= 140) return 'text-green-600'
        return 'text-red-600 font-bold'
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        })
    }

    return (
        <div className="print-section p-8 bg-white">
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-3xl font-bold mb-2">Blood Sugar Record</h1>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                        <p><strong>Patient:</strong> {user?.name || 'User'}</p>
                        <p><strong>Date:</strong> {formatDate(record.date)}</p>
                    </div>
                    <div className="text-right">
                        <p><strong>Printed:</strong> {new Date().toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            {/* Blood Sugar Readings */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold border-b border-black pb-2 mb-4">
                    Blood Sugar Readings (mg/dL)
                </h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center border-2 border-black p-3">
                        <p className="font-semibold text-lg">Before Breakfast</p>
                        <p className={`text-2xl ${getReadingStatus(record.beforeBreakfast)}`}>
                            {record.beforeBreakfast || 'N/A'}
                        </p>
                    </div>
                    <div className="text-center border-2 border-black p-3">
                        <p className="font-semibold text-lg">After Breakfast</p>
                        <p className={`text-2xl ${getReadingStatus(record.afterBreakfast)}`}>
                            {record.afterBreakfast || 'N/A'}
                        </p>
                    </div>
                    <div className="text-center border-2 border-black p-3">
                        <p className="font-semibold text-lg">After Lunch</p>
                        <p className={`text-2xl ${getReadingStatus(record.afterLunch)}`}>
                            {record.afterLunch || 'N/A'}
                        </p>
                    </div>
                    <div className="text-center border-2 border-black p-3">
                        <p className="font-semibold text-lg">After Dinner</p>
                        <p className={`text-2xl ${getReadingStatus(record.afterDinner)}`}>
                            {record.afterDinner || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Meal Information */}
            {(record.breakfastMeal || record.lunchMeal || record.dinnerMeal) && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold border-b border-black pb-2 mb-4">
                        Meal Information
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {record.breakfastMeal && (
                            <div className="border border-black p-3">
                                <p className="font-semibold text-lg mb-2">Breakfast</p>
                                <p className="text-sm">{record.breakfastMeal}</p>
                            </div>
                        )}
                        {record.lunchMeal && (
                            <div className="border border-black p-3">
                                <p className="font-semibold text-lg mb-2">Lunch</p>
                                <p className="text-sm">{record.lunchMeal}</p>
                            </div>
                        )}
                        {record.dinnerMeal && (
                            <div className="border border-black p-3">
                                <p className="font-semibold text-lg mb-2">Dinner</p>
                                <p className="text-sm">{record.dinnerMeal}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Normal Range Reference */}
            <div className="mt-8 p-4 border-2 border-black bg-gray-50">
                <h3 className="text-lg font-bold mb-2">Normal Blood Sugar Reference Ranges:</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p><strong>Fasting (Before meals):</strong> 70-100 mg/dL</p>
                    </div>
                    <div>
                        <p><strong>2 hours after meals:</strong> Less than 140 mg/dL</p>
                    </div>
                    <div>
                        <p><strong>HbA1c:</strong> Less than 5.7%</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm border-t border-black pt-4">
                <p>Generated by GlucoseTracker - Your Blood Sugar Monitoring Companion</p>
            </div>
        </div>
    )
}

export default PrintableRecord