import { apiSlice } from "../api/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    productList: builder.query({
      query: ({ tenant_id, page, page_size, search }) => {
        let url = "/products";
        const queryParams = new URLSearchParams();

        if (tenant_id) queryParams.append("tenant_id", tenant_id);
        if (page) queryParams.append("page", page);
        if (page_size) queryParams.append("page_size", page_size);
        if (search) queryParams.append("search", search);

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
        return {
          url,
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            // Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["products"],
    }),

    fetchProductFeed: builder.mutation({
      query: ({ tenant_id, payload }) => {
        return {
          url: `/products/fetch-product-feed/?tenant_id=${tenant_id}`,
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            // Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["products"],
    }),

    deleteProduct: builder.mutation({
      query: ({ tenant_id }) => {
        let url = `/products/delete-products/?tenant_id=${tenant_id}`;
        return {
          url,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            // Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["products"],
    }),

    searchProducts: builder.mutation({
      query: ({ tenant_id, user_query }) => {
        let url = "/products/search";
        const queryParams = new URLSearchParams();

        if (tenant_id) queryParams.append("tenant_id", tenant_id);
        if (user_query) queryParams.append("user_query", user_query);

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
        return {
          url,
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            // Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useProductListQuery,
  useFetchProductFeedMutation,
  useSearchProductsMutation,
  useDeleteProductMutation,
} = productApiSlice;
