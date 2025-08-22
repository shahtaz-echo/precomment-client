import MainLayout from "@/layouts/main-layout";
import Homepage from "@/pages/home";

import { createBrowserRouter } from "react-router";
import TenantProductPage from "./pages/tenants/products";
import TenantFaqPage from "./pages/tenants/faqs";
import TenantPageLayout from "./pages/tenants";
import ConversationPage from "./pages/tenants/conversation";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, // shorthand for path: "" under this layout
        element: <Homepage />,
      },
      {
        path: "tenants/:tenant_id", // no trailing slash needed
        element: <TenantPageLayout />,
        children: [
          {
            path: "", // default sub-route under TenantPage
            element: <ConversationPage />, // or replace with a TenantDetails component
          },
          {
            path: "products", // relative path
            element: <TenantProductPage />,
          },
          {
            path: "faqs", // relative path
            element: <TenantFaqPage />,
          },
        ],
      },
    ],
  },
]);
