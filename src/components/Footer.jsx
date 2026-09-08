import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-12">
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-white text-xl font-bold mb-2">Shopverse</h3>
                    <p className="text-sm text-gray-400">Quality products, fair prices, delivered to your door.</p>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-3">Quick links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
                        <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-3">Contact</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>support@shopverse.example</li>
                        <li>Mon-Sat, 9am - 6pm</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 py-4">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Shopverse. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
