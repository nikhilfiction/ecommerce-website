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
                state.items = action.payload.products;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
    }

})

export const { setFilters, setPage, resetFilters } = productSlice.actions;
export default productSlice.reducer;
