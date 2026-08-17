import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';

export function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Your Profile</CardTitle>
          <CardDescription>Join SportTalent AI and start your assessment journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Rahul" required />
              <Input label="Last Name" placeholder="Kumar" required />
            </div>
            <Input label="Email Address" type="email" placeholder="rahul@example.com" required />
            <Input label="Password" type="password" placeholder="Create a secure password" required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Age" type="number" placeholder="18" required />
              <div className="flex flex-col space-y-1.5 w-full">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="State" placeholder="Maharashtra" required />
              <Input label="District" placeholder="Pune" required />
            </div>

            <Button type="submit" className="w-full mt-6" size="lg" isLoading={isLoading}>
              Register Account
            </Button>
            
            <p className="text-center text-sm text-slate-600 mt-4">
              Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
