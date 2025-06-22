import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import NotFoundPage from "./pages/NotFound.js";
import EditorPage from "./pages/editor-page.js";
import { ThemeProvider } from "./components/theme-provider.js";

const router = createBrowserRouter([
  {
    path: "/notebook/:id", // Root path
    element: <EditorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element with id "root" not found');
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
