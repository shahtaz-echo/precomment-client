import React from "react";
import { RouterProvider } from "react-router";
import { routes } from "./routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  );
};

export default App;
