import { apiSlice } from "../api/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useCreateMessageMutation } = chatApiSlice;
