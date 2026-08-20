import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { ShieldCheck } from 'lucide-react';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-12 px-8 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-2">
            <ShieldCheck className="h-7 w-7 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Create an account to use this feature</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Sign up or log in to save your results and access your personalized athlete dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/register" className="flex-1">
              <Button className="w-full">Sign Up</Button>
            </Link>
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full">Log In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
