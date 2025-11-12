import React, { useEffect, useState } from 'react'
import RecordList from './components/RecordList'
import RecordModal from './components/RecordModal'
import Alert from './components/Alert'
import Login from './components/Login'
import { LogOut, User, BarChart3 } from 'lucide-react'
import { db, auth } from './firebase'
import { ref, set, get, child } from "firebase/database"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { recordService } from './services/recordService'

function App() {
    const [user, setUser] = useState(null)
    const [records, setRecords] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [alert, setAlert] = useState(null)
    const [loading, setLoading] = useState(true)

    // Show alert function
    const showAlert = (message, type = 'success') => {
        console.log('Showing alert:', message, type);
        setAlert({ message, type });
    };

    // Clear alert function
    const clearAlert = () => {
        console.log('Clearing alert');
        setAlert(null);
    };

    // Username-based authentication functions
    const findUserByUsername = async (username) => {
        try {
            console.log('Checking username:', username.toLowerCase())
            const snapshot = await get(child(ref(db), 'usernames/' + username.toLowerCase()))

            if (snapshot.exists()) {
                console.log('User found:', snapshot.val())
                return snapshot.val()
            } else {
                console.log('User not found for username:', username)
                return null
            }
        } catch (error) {
            console.error('Error finding user:', error)

            // More specific error handling
            if (error.code === 'PERMISSION_DENIED') {
                console.error('PERMISSION_DENIED: Check Firebase Database Rules')
                showAlert('Database configuration error. Please try again later.', 'error')
            } else if (error.message.includes('network') || error.code === 'NETWORK_ERROR') {
                showAlert('Network error. Please check your connection.', 'error')
            } else {
                showAlert('Error checking username availability', 'error')
            }

            return null
        }
    }

    const createUserWithUsername = async (username, password, name) => {
        try {
            // Check if username already exists
            const existingUser = await findUserByUsername(username.toLowerCase())
            if (existingUser) {
                throw new Error('Username already exists. Please choose a different username.')
            }

            // Validate password length
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long.')
            }

            // Create Firebase user with email-style format
            const email = `${username.toLowerCase()}@glucosetracker.app`
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            // Store username mapping
            await set(ref(db, 'usernames/' + username.toLowerCase()), {
                uid: firebaseUser.uid,
                username: username.toLowerCase(),
                name: name,
                email: email,
                createdAt: new Date().toISOString()
            })

            // Store user profile
            await set(ref(db, 'users/' + firebaseUser.uid + '/profile'), {
                username: username.toLowerCase(),
                name: name,
                email: email,
                createdAt: new Date().toISOString()
            })

            return {
                uid: firebaseUser.uid,
                username: username.toLowerCase(),
                name: name,
                email: email
            }
        } catch (error) {
            console.error('Error creating user:', error)

            // Handle specific Firebase auth errors
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('Username already exists. Please choose a different username.')
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Password must be at least 6 characters long.')
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Invalid username format.')
            } else if (error.code === 'auth/operation-not-allowed') {
                throw new Error('Email/password accounts are not enabled. Please contact support.')
            } else if (error.code === 'PERMISSION_DENIED') {
                throw new Error('Database permission denied. Please check Firebase configuration.')
            } else {
                throw new Error('Failed to create account. Please try again.')
            }
        }
    }

    const loginWithUsername = async (username, password) => {
        try {
            console.log('Finding user by username:', username);

            // Find user by username
            const userData = await findUserByUsername(username.toLowerCase())
            if (!userData) {
                console.log('User not found in database');
                throw new Error('User not found. Please check your username or create a new account.')
            }

            console.log('User found, attempting login...');

            // Validate password
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long.')
            }

            // Login with email/password (using the generated email)
            const email = `${username.toLowerCase()}@glucosetracker.app`
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            console.log('Firebase login successful');

            return {
                uid: firebaseUser.uid,
                username: userData.username,
                name: userData.name,
                email: userData.email
            }
        } catch (error) {
            console.error('Login error in loginWithUsername:', error.code, error.message);

            // Handle specific Firebase auth errors
            if (error.code === 'auth/user-not-found') {
                throw new Error('User not found. Please check your username or create a new account.')
            } else if (error.code === 'auth/wrong-password') {
                throw new Error('Incorrect password. Please try again.')
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Invalid username format.')
            } else if (error.code === 'auth/user-disabled') {
                throw new Error('This account has been disabled. Please contact support.')
            } else if (error.code === 'auth/too-many-requests') {
                throw new Error('Too many failed attempts. Please try again later.')
            } else {
                throw new Error(error.message || 'Login failed. Please check your credentials and try again.')
            }
        }
    }

    // Firebase Auth State Listener
    useEffect(() => {
        let recordsUnsubscribe = null;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get user profile from database
                    const snapshot = await get(child(ref(db), 'users/' + firebaseUser.uid + '/profile'))
                    if (snapshot.exists()) {
                        const userProfile = snapshot.val()
                        const userData = {
                            uid: firebaseUser.uid,
                            username: userProfile.username,
                            name: userProfile.name,
                            email: userProfile.email
                        }
                        setUser(userData)

                        // Listen to user's records using recordService
                        setLoading(true)
                        recordsUnsubscribe = recordService.listenToRecords(firebaseUser.uid, (firebaseRecords) => {
                            console.log('Records loaded from Firebase:', firebaseRecords)
                            setRecords(firebaseRecords)
                            setLoading(false)
                        })
                    }
                } catch (error) {
                    console.error('Error loading user profile:', error)
                    showAlert('Error loading your profile', 'error')
                    setLoading(false)
                }
            } else {
                setUser(null)
                setRecords([])
                setLoading(false)

                // Clean up records listener when user logs out
                if (recordsUnsubscribe) {
                    recordsUnsubscribe()
                }
            }
        })

        return () => {
            unsubscribe()
            if (recordsUnsubscribe) {
                recordsUnsubscribe()
            }
        }
    }, [])

    // Auth functions
    const handleLogin = async (userData) => {
        try {
            const { username, password } = userData

            console.log('Login attempt for:', username);

            // Basic validation
            if (!username.trim()) {
                showAlert('Please enter a username', 'error')
                return
            }
            if (!password.trim()) {
                showAlert('Please enter a password', 'error')
                return
            }
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error')
                return
            }

            console.log('Calling loginWithUsername...');
            const user = await loginWithUsername(username, password)
            console.log('Login successful:', user.name);
            showAlert(`Welcome back, ${user.name}!`, 'success')

        } catch (error) {
            console.error('Login error in handleLogin:', error.message);
            showAlert(error.message, 'error')
            throw error;
        }
    }

    const handleSignUp = async (userData) => {
        try {
            const { username, password, name } = userData

            // Basic validation
            if (!username.trim()) {
                showAlert('Please enter a username', 'error')
                return
            }
            if (!password.trim()) {
                showAlert('Please enter a password', 'error')
                return
            }
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error')
                return
            }
            if (!name.trim()) {
                showAlert('Please enter your name', 'error')
                return
            }

            const user = await createUserWithUsername(username, password, name)
            showAlert(`Account created for ${user.name}! Please sign in with your credentials.`, 'success')
            return true

        } catch (error) {
            console.error('Signup error:', error)
            showAlert(error.message, 'error')
            throw error
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            showAlert('Logged out successfully', 'info')
        } catch (error) {
            console.error('Logout error:', error)
            showAlert('Logout failed. Please try again.', 'error')
        }
    }

    // Record functions using Firebase service
    const handleAdd = async (record) => {
        try {
            await recordService.createRecord(user.uid, record)
            setModalOpen(false)
            showAlert('Record added successfully!', 'success')
        } catch (error) {
            console.error('Error adding record:', error)
            showAlert('Error adding record. Please try again.', 'error')
        }
    }

    const handleUpdate = async (updated) => {
        try {
            await recordService.updateRecord(user.uid, updated.id, updated)
            setEditing(null)
            setModalOpen(false)
            showAlert('Record updated successfully!', 'success')
        } catch (error) {
            console.error('Error updating record:', error)
            showAlert('Error updating record. Please try again.', 'error')
        }
    }

    const handleDelete = async (id) => {
        try {
            await recordService.deleteRecord(user.uid, id)
            showAlert('Record deleted successfully!', 'warning')
        } catch (error) {
            console.error('Error deleting record:', error)
            showAlert('Error deleting record. Please try again.', 'error')
        }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your data...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Login onLogin={handleLogin} onSignUp={handleSignUp} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Alert Container */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4">
                {alert && (
                    <div key={Date.now()}>
                        <Alert
                            message={alert.message}
                            type={alert.type}
                            onClose={clearAlert}
                        />
                    </div>
                )}
            </div>

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
                                <p className="text-xs text-gray-500">@{user.username}</p>
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

                            {/* <button
                                onClick={openNew}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:px-4 sm:py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center sm:justify-start space-x-0 sm:space-x-2 min-w-[44px] sm:min-w-auto"
                                aria-label="Add new reading"
                            >
                                <span className="text-lg">+</span>
                                <span className="hidden sm:inline">New Reading</span>
                            </button> */}
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
                        <RecordList records={records} onEdit={openEdit} onDelete={handleDelete} user={user} onNew={openNew} />

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