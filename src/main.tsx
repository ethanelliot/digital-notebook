import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import ProtectedRoute from './components/auth/protected-route.js'
import DashboardLayout from './components/dashboard/dashboard-layout.js'
import { ThemeProvider } from './components/theme-provider.js'
import { AuthProvider } from './contexts/auth-context.js'
import { DialogProvider } from './contexts/dialog-context.js'
import { WorkspaceProvider } from './contexts/workspace-context.js'
import CalendarPage from './pages/calender-page.js'
import EditorPage from './pages/editor-page.js'
import GroupsPage from './pages/groups-page.js'
import HomePage from './pages/home-page.js'
import LoginPage from './pages/login-page.js'
import NotFoundPage from './pages/not-found.js'
import NotesPage from './pages/notes-page.js'
import SettingsPage from './pages/settings-page.js'

const router = createBrowserRouter([
  // protected
  {
    element: (
      <WorkspaceProvider>
        <DialogProvider>
          <ProtectedRoute />
        </DialogProvider>
      </WorkspaceProvider>
    ),
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <HomePage />,
          },
          {
            path: 'notes',
            element: <NotesPage />,
          },
          {
            path: 'calendar',
            element: <CalendarPage />,
          },
          {
            path: 'groups',
            element: <GroupsPage />,
          },
          {
            path: 'settings',
            element: <Navigate to="/settings/profile" replace />,
          },
          {
            path: 'settings/:tab',
            element: <SettingsPage />,
          },
        ],
      },
      {
        path: '/notebook/:notebookId', // Root path
        element: <EditorPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element with id "root" not found')
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)
