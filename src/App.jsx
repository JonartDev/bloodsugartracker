import React, { useEffect, useState } from 'react'
import RecordList from './components/RecordList'
import RecordModal from './components/RecordModal'
import Alert from './components/Alert'
import Login from './components/Login'
import { LogOut, User, BarChart3 } from 'lucide-react'

function App() {
    const [user, setUser] = useState(null)
    const [records, setRecords] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [alert, setAlert] = useState(null)

    // Show alert function
    const showAlert = (message, type = 'success') => {
        setAlert({ message, type })
        setTimeout(() => setAlert(null), 3000)
    }

    // Initialize user and records
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
            const userRecords = localStorage.getItem(`records_${JSON.parse(savedUser).id}`)
            setRecords(userRecords ? JSON.parse(userRecords) : [])
        }
    }, [])

    // Save records when they change
    useEffect(() => {
        if (user) {
            localStorage.setItem(`records_${user.id}`, JSON.stringify(records))
        }
    }, [records, user])

    // Auth functions
    const handleLogin = (userData) => {
        // In a real app, you would verify credentials against a database
        // For this demo, we'll just create a user session
        const user = {
            id: Date.now().toString(),
            name: userData.name,
            username: userData.username
            // Never store passwords in localStorage in real applications!
        }

        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))

        // Load user-specific records
        const userRecords = localStorage.getItem(`records_${user.id}`)
        setRecords(userRecords ? JSON.parse(userRecords) : [])

        showAlert(`Welcome back, ${userData.name}!`, 'success')
    }
    const handleLogout = () => {
        setUser(null)
        setRecords([])
        localStorage.removeItem('user')
        showAlert('Logged out successfully', 'info')
    }

    // Record functions
    const handleAdd = (record) => {
        const newRecord = {
            ...record,
            id: Date.now(),
            userId: user.id
        }
        setRecords(prev => [newRecord, ...prev])
        setModalOpen(false)
        showAlert('Record added successfully!', 'success')
    }

    const handleUpdate = (updated) => {
        setRecords(prev => prev.map(r => (r.id === updated.id ? updated : r)))
        setEditing(null)
        setModalOpen(false)
        showAlert('Record updated successfully!', 'success')
    }

    const handleDelete = (id) => {
        setRecords(prev => prev.filter(r => r.id !== id))
        showAlert('Record deleted successfully!', 'warning')
    }

    const openNew = () => {
        setEditing(null)
        setModalOpen(true)
    }

    const openEdit = (record) => {
        setEditing(record)
        setModalOpen(true)
    }

    // Calculate statistics
    const getStats = () => {
        if (records.length === 0) return null

        const readings = records.flatMap(record => [
            record.beforeBreakfast,
            record.afterBreakfast,
            record.afterLunch,
            record.afterDinner
        ].filter(val => val !== '').map(Number))

        if (readings.length === 0) return null

        const average = readings.reduce((a, b) => a + b, 0) / readings.length
        const max = Math.max(...readings)
        const min = Math.min(...readings)

        return { average: average.toFixed(1), max, min, totalRecords: records.length }
    }

    const stats = getStats()

    if (!user) {
        return <Login onLogin={handleLogin} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Alert Container */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">GlucoseTracker</h1>
                                <p className="text-sm text-gray-600">Hello, {user.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Stats */}
                            {stats && (
                                <div className="hidden md:flex items-center space-x-4 text-sm">
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900">{stats.average}</p>
                                        <p className="text-gray-600 text-xs">Avg</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-green-600">{stats.min}</p>
                                        <p className="text-gray-600 text-xs">Low</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-red-600">{stats.max}</p>
                                        <p className="text-gray-600 text-xs">High</p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={openNew}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                + New Reading
                            </button>

                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Stats */}
                {stats && (
                    <div className="md:hidden grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                            <p className="text-2xl font-bold text-gray-900">{stats.average}</p>
                            <p className="text-gray-600 text-sm">Average</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                            <p className="text-2xl font-bold text-green-600">{stats.min}</p>
                            <p className="text-gray-600 text-sm">Lowest</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                            <p className="text-2xl font-bold text-red-600">{stats.max}</p>
                            <p className="text-gray-600 text-sm">Highest</p>
                        </div>
                    </div>
                )}

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Blood Sugar Records</h2>
                                <p className="text-gray-600 mt-1">
                                    {records.length} record{records.length !== 1 ? 's' : ''} total
                                </p>
                            </div>

                            {/* Mobile Add Button */}
                            <button
                                onClick={openNew}
                                className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg w-full text-center"
                            >
                                + Add New Reading
                            </button>
                        </div>

                        <RecordList records={records} onEdit={openEdit} onDelete={handleDelete} />

                        {records.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BarChart3 className="h-10 w-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No records yet</h3>
                                <p className="text-gray-600 mb-6">Start tracking your blood sugar levels to see your data here.</p>
                                <button
                                    onClick={openNew}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                                >
                                    Add Your First Reading
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {modalOpen && (
                <RecordModal
                    onClose={() => {
                        setModalOpen(false)
                        setEditing(null)
                    }}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    editing={editing}
                />
            )}
        </div>
    )
}

export default App