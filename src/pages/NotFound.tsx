// src/pages/NotFoundPage.jsx
import React from "react";

function NotFoundPage() {
  return (
    <div id="error-page" className="text-center mt-10">
      <h1 className="text-4xl">404!</h1>
      <p>Sorry, Page not found</p>
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}

export default NotFoundPage;
