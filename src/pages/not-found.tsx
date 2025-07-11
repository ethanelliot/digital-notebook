// src/pages/NotFoundPage.jsx
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center h-screen text-center gap-3"
    >
      <h1 className="text-9xl">404!</h1>
      <p>Sorry, Page not found</p>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  )
}

export default NotFoundPage
