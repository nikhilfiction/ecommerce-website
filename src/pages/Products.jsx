import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories, setFilters, setPage } from "../features/productSlice";
import { addItemToCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, loading, error, categories, filters, page, totalPages, totalItems } = useSelector(
        (state) => state.products
    )
    const { token } = useSelector((state) => state.auth)

    // local input state so typing doesn't refetch on every keystroke
    const [searchInput, setSearchInput] = useState(filters.search);

    // debounce the search box -> only updates the real filter (and refetches) after user stops typing
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchInput !== filters.search) {
                dispatch(setFilters({ search: searchInput }));
            }
        }, 400);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, filters]);

    const handleAddToCart = (product) => {
        if (!token) {
            navigate("/login");
            return
        }
        dispatch(addItemToCart({ productId: product._id, quantity: 1 }))
    }

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        dispatch(setPage(newPage));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Products</h2>

            {/* Filter bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 md:items-center">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                />

                <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="border rounded px-3 py-2 w-28"
                />
                <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="border rounded px-3 py-2 w-28"
                />

                <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>

            {loading && <div className="container mx-auto">Loading...</div>}
            {error && <div className="container mx-auto text-red-500">Error: {error?.message || String(error)}</div>}

            {!loading && !error && products.length === 0 && (
                <div className="text-gray-500">No products match your filters.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 shadow rounded flex flex-col">
                        <img src={product.image} alt={product.title} className="h-48 object-cover mb-4 rounded" />
                        <h3 className="text-lg font-bold">{product.title}</h3>
                        <p className="text-gray-600 my-2">${product.price}</p>
                        <p className="text-gray-500 mb-2">{product.description}</p>
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add to cart</button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 mb-4">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Prev
                    </button>
                    <span className="text-gray-600">
                        Page {page} of {totalPages} ({totalItems} products)
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
