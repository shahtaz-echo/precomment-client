import { apiSlice } from "../api/apiSlice";

export const faqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    faqLinkList: builder.query({
      query: ({ tenant_id, page, page_size, search }) => {
        let url = "/faqs/faq-links/";
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
      providesTags: ["faq-links"],
    }),

    createFAQLink: builder.mutation({
      query: ({ tenant_id, payload }) => {
        return {
          url: `/faqs/create-faq-link/?tenant_id=${tenant_id}`,
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            // Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["faq-links"],
    }),

    deleteFAQLink: builder.mutation({
      query: ({ faq_link_id }) => {
        let url = `/faqs/delete-faq-link/?faq_link_id=${faq_link_id}`;
        return {
          url,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            // Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["faq-links"],
    }),

    faqList: builder.query({
      query: ({ faq_link_id, page, page_size, search }) => {
        let url = "/faqs/";
        const queryParams = new URLSearchParams();

        if (faq_link_id) queryParams.append("faq_link_id", faq_link_id);
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
      providesTags: ["faq-links"],
    }),

    searchFAQs: builder.mutation({
      query: ({ tenant_id, user_query }) => {
        let url = "/faqs/search";
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
  useFaqLinkListQuery,
  useDeleteFAQLinkMutation,
  useCreateFAQLinkMutation,
  useFaqListQuery,
  useSearchFAQsMutation,
} = faqApiSlice;
