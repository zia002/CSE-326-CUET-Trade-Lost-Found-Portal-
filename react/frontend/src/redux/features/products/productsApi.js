import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseURL } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // ✅ Get all products
    fetchProducts: builder.query({
      query: () => "/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Products", id: _id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // ✅ Get single product
    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ✅ Create product
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    // ✅ Update product
    updateProduct: builder.mutation({
      query: ({ id, ...updatedProduct }) => ({
        url: `/update-product/${id}`,
        method: "PATCH",
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // ✅ Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // ✅ Place Bid on Pre-Owned Product
    placeBid: builder.mutation({
      query: ({ id, biddingPrice }) => ({
        url: `/place-bid/${id}`,
        method: "POST",
        body: { biddingPrice },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  usePlaceBidMutation, // ← make sure to use this in ProductDetails.jsx
} = productsApi;

export default productsApi;
