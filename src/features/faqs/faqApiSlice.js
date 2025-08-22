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
  }),
});

export const { useFaqLinkListQuery } = faqApiSlice;
