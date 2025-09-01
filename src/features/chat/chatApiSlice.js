import { apiSlice } from "../api/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (payload) => {
        return {
          url: "/chat",
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            // Authorization: `Bearer ${token}`,
          },
          body: payload,
        };
      },
    }),
  }),
});

export const { useCreateMessageMutation } = chatApiSlice;
