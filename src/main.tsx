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
import { DialogProvider } from "./contexts/dialog-context.js";
import { AuthProvider } from "./contexts/auth-context.js";
import ProtectedRoute from "./components/auth/protected-route.js";
import LoginPage from "./pages/login-page.js";

const router = createBrowserRouter([
  // protected
  {
    element: <ProtectedRoute />,
    children: [
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
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
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
    <AuthProvider>
      <WorkspaceProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <DialogProvider>
            <RouterProvider router={router} />
          </DialogProvider>
        </ThemeProvider>
      </WorkspaceProvider>
    </AuthProvider>
  </React.StrictMode>
);
