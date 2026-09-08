import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// params: { search, category, minPrice, maxPrice, sort, page, limit }
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await API.get("/products", { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchCategories = createAsyncThunk(
    "products/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/products/categories");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const initialFilters = {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
    limit: 12,
};

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
        categories: [],
        filters: initialFilters,
        page: 1,
        totalPages: 1,
        totalItems: 0,
    },
    reducers: {
        setFilters: (state, action) => {
            // merging new filter values resets to page 1 unless page itself was passed
            state.filters = { ...state.filters, ...action.payload };
            if (!("page" in action.payload)) {
                state.filters.page = 1;
            }
        },
        setPage: (state, action) => {
            state.filters.page = action.payload;
        },
        resetFilters: (state) => {
            state.filters = initialFilters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload;
                // tolerate an older/mismatched backend that still returns a plain array
                const list = Array.isArray(payload) ? payload : payload?.products;
                state.items = Array.isArray(list) ? list : [];
                state.page = payload?.page ?? 1;
                state.totalPages = payload?.totalPages ?? 1;
                state.totalItems = payload?.totalItems ?? state.items.length;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.items = [];
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchCategories.rejected, (state) => {
                // categories are a nice-to-have filter; never let this break the page
                state.categories = [];
            })
    }

})

export const { setFilters, setPage, resetFilters } = productSlice.actions;
export default productSlice.reducer;
