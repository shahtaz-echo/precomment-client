import { apiSlice } from "../api/apiSlice";

export const tenantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // createTenant: builder.mutation({
    //   query: (data) => {
    //     const { bodyData, token } = data;
    //     return {
    //       url: `orders`,
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json;charset=UTF-8",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: bodyData,
    //     };
    //   },
    //   invalidatesTags: ["order", "myProfile"],
    // }),

    // updateOrder: builder.mutation({
    //   query: (data) => {
    //     const { id, bodyData, token } = data;
    //     return {
    //       url: `orders/${id}`,
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json;charset=UTF-8",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: bodyData,
    //     };
    //   },
    //   invalidatesTags: ["order"],
    // }),

    
    tenantList: builder.query({
      query: ({ page, page_size, search}) => {
        let url = "/tenants/";
        const queryParams = new URLSearchParams();

        if (search) queryParams.append("search", search);
        if (page) queryParams.append("page", page);
        if (page_size) queryParams.append("page_size", page_size);

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
      providesTags: ["tenants"],
    }),

    tenantDetails: builder.query({
      query: ({ tenant_id }) => {
        return {
          url: `/tenants/${tenant_id}`,
          method: "GET",
          headers: {
              "Content-Type": "application/json;charset=UTF-8",
              // Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["tenant-details"],
    }),

    // deleteOrder: builder.mutation({
    //   query: (data) => {
    //     const { id, token } = data;
    //     return {
    //       url: `/orders/${id}`,
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json;charset=UTF-8",
    //       },
    //     };
    //   },
    //   invalidatesTags: ["order"],
    // }),
  }),
});

export const {
  useTenantListQuery,
  useTenantDetailsQuery,
} = tenantApiSlice;
