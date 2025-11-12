import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Utensils } from 'lucide-react'

const emptyForm = () => ({
    date: new Date().toISOString().slice(0, 10),
    beforeBreakfast: '',
    afterBreakfast: '',
    afterLunch: '',
    afterDinner: '',
    breakfastMeal: '',
    lunchMeal: '',
    dinnerMeal: ''
})

export default function RecordForm({ initial, onCancel, onAdd, onUpdate }) {
    const [form, setForm] = useState(emptyForm())
    const [errors, setErrors] = useState({})

    // Use useEffect only when initial changes
    useEffect(() => {
        if (initial) {
            setForm({ ...emptyForm(), ...initial })
        } else {
            setForm(emptyForm())
        }
    }, [initial])

    // Simplified handleChange without error clearing during typing
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!form.date) {
            newErrors.date = 'Date is required'
        }

        // Validate that at least one reading is provided
        const readingFields = ['beforeBreakfast', 'afterBreakfast', 'afterLunch', 'afterDinner']
        const hasReadings = readingFields.some(field => form[field] && form[field].trim() !== '')

        if (!hasReadings) {
            newErrors.readings = 'At least one blood sugar reading is required'
        }

        // Validate that readings are numbers if provided
        readingFields.forEach(field => {
            if (form[field] && form[field].trim() !== '') {
                const value = Number(form[field])
                if (isNaN(value) || value < 0 || value > 1000) {
                    newErrors[field] = 'Must be a valid number between 0 and 1000'
                }
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        // Clean the data - remove empty strings
        const cleanedData = {
            ...form,
            beforeBreakfast: form.beforeBreakfast.trim() || '',
            afterBreakfast: form.afterBreakfast.trim() || '',
            afterLunch: form.afterLunch.trim() || '',
            afterDinner: form.afterDinner.trim() || '',
            breakfastMeal: form.breakfastMeal.trim() || '',
            lunchMeal: form.lunchMeal.trim() || '',
            dinnerMeal: form.dinnerMeal.trim() || ''
        }

        if (initial && initial.id) {
            onUpdate({ ...cleanedData, id: initial.id })
        } else {
            onAdd(cleanedData)
        }
    }

    const formatDisplayDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errors.readings && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.readings}
                </div>
            )}

            {/* // Then in your JSX: */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Select Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                                    } appearance-none`}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-gray-500">
                            Selected: {formatDisplayDate(form.date)}
                        </p>
                        {errors.date && (
                            <p className="text-red-500 text-xs flex items-center mt-1">
                                <span className="mr-1">⚠</span>
                                {errors.date}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Blood Sugar Readings */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Blood Sugar Readings (mg/dL)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Before Breakfast
                        </label>
                        <input
                            type="text"
                            name="beforeBreakfast"
                            value={form.beforeBreakfast}
                            onChange={handleChange}
                            placeholder="Fasting level"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.beforeBreakfast ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.beforeBreakfast && (
                            <p className="text-red-500 text-xs">{errors.beforeBreakfast}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            After Breakfast
                        </label>
                        <input
                            type="text"
                            name="afterBreakfast"
                            value={form.afterBreakfast}
                            onChange={handleChange}
                            placeholder="2 hours after"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.afterBreakfast ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.afterBreakfast && (
                            <p className="text-red-500 text-xs">{errors.afterBreakfast}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            After Lunch
                        </label>
                        <input
                            type="text"
                            name="afterLunch"
                            value={form.afterLunch}
                            onChange={handleChange}
                            placeholder="2 hours after"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.afterLunch ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.afterLunch && (
                            <p className="text-red-500 text-xs">{errors.afterLunch}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            After Dinner
                        </label>
                        <input
                            type="text"
                            name="afterDinner"
                            value={form.afterDinner}
                            onChange={handleChange}
                            placeholder="2 hours after"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.afterDinner ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.afterDinner && (
                            <p className="text-red-500 text-xs">{errors.afterDinner}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Meal Information */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Meal Information (Optional)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Breakfast Meal
                        </label>
                        <input
                            type="text"
                            name="breakfastMeal"
                            value={form.breakfastMeal}
                            onChange={handleChange}
                            placeholder="Oatmeal, eggs, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Lunch Meal
                        </label>
                        <input
                            type="text"
                            name="lunchMeal"
                            value={form.lunchMeal}
                            onChange={handleChange}
                            placeholder="Salad, sandwich, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Dinner Meal
                        </label>
                        <input
                            type="text"
                            name="dinnerMeal"
                            value={form.dinnerMeal}
                            onChange={handleChange}
                            placeholder="Chicken, rice, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    {initial ? 'Update Record' : 'Add Record'}
                </button>
            </div>
        </form>
    )
}