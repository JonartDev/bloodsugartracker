import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Utensils, X } from 'lucide-react'

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

    useEffect(() => {
        if (initial) {
            setForm({ ...emptyForm(), ...initial })
        } else {
            setForm(emptyForm())
        }
    }, [initial])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
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

    const ReadingInput = ({ label, name, placeholder = "e.g. 120" }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors[name] && (
                <p className="text-red-500 text-xs">{errors[name]}</p>
            )}
        </div>
    )

    const MealInput = ({ label, name, placeholder = "What did you eat?" }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errors.readings && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.readings}
                </div>
            )}

            {/* Date Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                errors.date ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.date && (
                            <p className="text-red-500 text-xs">{errors.date}</p>
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
                    <ReadingInput 
                        label="Before Breakfast" 
                        name="beforeBreakfast" 
                        placeholder="Fasting level"
                    />
                    <ReadingInput 
                        label="After Breakfast" 
                        name="afterBreakfast" 
                        placeholder="2 hours after"
                    />
                    <ReadingInput 
                        label="After Lunch" 
                        name="afterLunch" 
                        placeholder="2 hours after"
                    />
                    <ReadingInput 
                        label="After Dinner" 
                        name="afterDinner" 
                        placeholder="2 hours after"
                    />
                </div>
            </div>

            {/* Meal Information */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Meal Information (Optional)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MealInput 
                        label="Breakfast Meal" 
                        name="breakfastMeal" 
                        placeholder="Oatmeal, eggs, etc."
                    />
                    <MealInput 
                        label="Lunch Meal" 
                        name="lunchMeal" 
                        placeholder="Salad, sandwich, etc."
                    />
                    <MealInput 
                        label="Dinner Meal" 
                        name="dinnerMeal" 
                        placeholder="Chicken, rice, etc."
                    />
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