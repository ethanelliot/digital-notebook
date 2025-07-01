import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import NotFoundPage from "./pages/not-found.js";
import EditorPage from "./pages/editor-page.js";
import HomePage from "./pages/home-page.js";
import GroupsPage from "./pages/groups-page.js";
import NotesPage from "./pages/notes-page.js";
import { ThemeProvider } from "./components/theme-provider.js";
import DashboardLayout from "./components/dashboard/dashboard-layout.js";
import { WorkspaceProvider } from "./contexts/workspace-context.js";
import CalendarPage from "./pages/calender-page.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "notes",
        element: <NotesPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "groups",
        element: <GroupsPage />,
      },
    ],
  },
  {
    path: "/notebook/:notebookId", // Root path
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
    <WorkspaceProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </WorkspaceProvider>
  </React.StrictMode>
);
