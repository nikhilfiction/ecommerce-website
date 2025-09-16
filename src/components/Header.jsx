import { Link } from "react-router-dom";

const Header = () => {
    return <header className="bg-white shadow">
        {/* Title */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2x1 font-bold text-gray-800">
            Ecommerce
            </Link>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="text-gray-600 hover:text-gray-800">
                        Home
                        </Link>
                    </li>
                    
                </ul>
            </nav>
        </div>
        {/* links */}
    </header>
};

export default Header;