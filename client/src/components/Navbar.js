import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout } = React.useContext(AuthContext);

    return (
        <nav className="bg-gray-900 p-4 flex justify-between items-center">
            {/* Application Title */}
            <div className="text-white text-3xl font-bold">
                <Link to="/" className="font-serif hover:text-yellow-400 transition duration-300">
                    Stack Overflow Lite
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-4">
                {isAuthenticated ? (
                    <>
                        <Link 
                            to="/profile" 
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                            Profile
                        </Link>
                        <button 
                            onClick={logout} 
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link 
                            to="/signup" 
                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
                        >
                            Register
                        </Link>
                        <Link 
                            to="/signin" 
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
