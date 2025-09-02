import { apiSlice } from "../api/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sessionList: builder.query({
      query: ({ tenant_id, page, page_size }) => {
        let url = "/chat/sessions";
        const queryParams = new URLSearchParams();

        if (tenant_id) queryParams.append("tenant_id", tenant_id);
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
      providesTags: ["sessions"],
    }),

    getMessagesBySession: builder.query({
      query: ({ session_id, page, page_size }) => {
        let url = `/chat/sessions/${session_id}/messages`;
        const queryParams = new URLSearchParams();

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
      providesTags: ["session-messages"],
    }),

    createMessage: builder.mutation({
      query: ({ payload, session_id }) => {
        const url = session_id ? `/chat?session_id=${session_id}` : "/chat";
        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: payload,
        };
      },
    }),
  }),
});

export const {
  useSessionListQuery,
  useGetMessagesBySessionQuery,
  useCreateMessageMutation,
} = chatApiSlice;
