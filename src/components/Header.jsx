import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { ShoppingCart, Menu, X } from "react-feather";

const navLinkClass = ({ isActive }) =>
    `nav-link text-gray-600 hover:text-brand-600 font-medium transition-colors ${isActive ? "active text-brand-600" : ""}`;

const Header = () => {
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);

    const { isAuthenticated, user } = useSelector((state) => ({
        isAuthenticated: !!state.auth.token,
        user: state.auth.user,
    }))

    const { items } = useSelector((state) => state.cart)
    const handleLogout = () => {
        dispatch(logoutUser());
        setMenuOpen(false);
    }

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <NavLink to="/" className="flex items-center gap-2 text-2xl font-extrabold text-gray-900" onClick={() => setMenuOpen(false)}>
                    <span className="bg-brand-600 text-white rounded-lg w-9 h-9 flex items-center justify-center text-lg">S</span>
                    Shopverse
                </NavLink>

                {/* Desktop nav */}
                <nav className="hidden md:block">
                    <ul className="flex items-center space-x-8">
                        <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
                        <li><NavLink to="/products" className={navLinkClass}>Products</NavLink></li>
                        <li>
                            <NavLink to="/cart" className={navLinkClass}>
                                <span className="flex items-center gap-1">
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="bg-brand-600 text-white text-xs rounded-full px-2 py-0.5 leading-none">{cartCount}</span>
                                    )}
                                </span>
                            </NavLink>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li><NavLink to="/login" className={navLinkClass}>Login</NavLink></li>
                                <li>
                                    <NavLink to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full font-medium transition-colors">
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="text-gray-600">Hi, {user?.name || "User"}</li>
                                <li>
                                    <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 font-medium transition-colors">
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile nav */}
            {menuOpen && (
                <nav className="md:hidden border-t border-gray-100 bg-white">
                    <ul className="flex flex-col divide-y divide-gray-100">
                        <li><NavLink onClick={() => setMenuOpen(false)} to="/" end className="block px-4 py-3 text-gray-700">Home</NavLink></li>
                        <li><NavLink onClick={() => setMenuOpen(false)} to="/products" className="block px-4 py-3 text-gray-700">Products</NavLink></li>
                        <li>
                            <NavLink onClick={() => setMenuOpen(false)} to="/cart" className="flex items-center gap-2 px-4 py-3 text-gray-700">
                                <ShoppingCart className="w-5 h-5" /> Cart {cartCount > 0 && `(${cartCount})`}
                            </NavLink>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li><NavLink onClick={() => setMenuOpen(false)} to="/login" className="block px-4 py-3 text-gray-700">Login</NavLink></li>
                                <li><NavLink onClick={() => setMenuOpen(false)} to="/register" className="block px-4 py-3 text-brand-600 font-medium">Register</NavLink></li>
                            </>
                        ) : (
                            <>
                                <li className="px-4 py-3 text-gray-500">Hi, {user?.name || "User"}</li>
                                <li>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 font-medium">
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
