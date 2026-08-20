import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const name = `${firstName} ${lastName}`.trim();
      const response = await api.register({
        name,
        email,
        password,
        age: parseInt(age, 10),
        gender,
        state,
        district
      });
      
      login(response.token, response.user);
      showToast('Successfully registered!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
      showToast('Failed to register.', 'error');
    } finally {
      setIsLoading(false);
    }
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
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Rahul" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <Input label="Last Name" placeholder="Kumar" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <Input label="Email Address" type="email" placeholder="rahul@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="Create a secure password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Age" type="number" placeholder="18" value={age} onChange={(e) => setAge(e.target.value)} required />
              <div className="flex flex-col space-y-1.5 w-full">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="State" placeholder="Maharashtra" value={state} onChange={(e) => setState(e.target.value)} required />
              <Input label="District" placeholder="Pune" value={district} onChange={(e) => setDistrict(e.target.value)} required />
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
