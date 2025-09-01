import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseURL,
  }),

  tagTypes: ["tenants", "tenant-details", "faq-links", "products"],
  endpoints: (builder) => ({}),
});
