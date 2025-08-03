// app/components/Navbar.tsx
'use client';

import { useAuth } from '../lib/AuthContext';
import { useMemo } from 'react';

/**
 * Navbar component that handles user sign-in and sign-out logic.
 */
const Navbar = () => {
    const { user, loading, signInWithGoogle, logout } = useAuth();

    // Memoize user greeting to avoid re-rendering
    const greeting = useMemo(() => {
        if (!user) return '';
        return `Welcome, ${user.displayName || user.email}!`;
    }, [user]);

    if (loading) {
        return null;
    }

    const authButton = user ? (
        <div className="flex items-center space-x-4" >
            <span className="text-sm" > {greeting} </span>
            < button
                onClick={logout}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
                Sign Out
            </button>
        </div>
    ) : (
        <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
            Sign in with Google
        </button>
    );

    return (
        <nav className="p-4 bg-gray-800 text-white shadow-md flex justify-between items-center fixed w-full top-0 z-50" >
            <h1 className="text-xl font-bold" > Ceylon Chronicles </h1>
            < div > {authButton} </div>
        </nav>
    );
};

export default Navbar;
