// src/pages/NotFoundPage.jsx
import { Button } from '@/components/ui/button'

function ErrorPage() {
  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center h-screen text-center gap-3"
    >
      <h1 className="text-9xl">Error!</h1>
      <p>Sorry, An unexpected error occoured!</p>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  )
}

export default ErrorPage
