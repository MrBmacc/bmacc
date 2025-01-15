import { Link } from "@tanstack/react-router";

import character from "@/assets/bmacc-character.png";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function PageNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <img src={character} alt="BMACC" className="w-24" />
        <Card>
          <CardHeader>
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <h2 className="text-xl text-gray-600">Page Not Found</h2>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
