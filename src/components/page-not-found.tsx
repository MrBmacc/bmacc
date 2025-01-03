import { Link } from "@tanstack/react-router";

export function PageNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-5">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <h2 className="text-xl text-gray-600">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto text-balance">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
