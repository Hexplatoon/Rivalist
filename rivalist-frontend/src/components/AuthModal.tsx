import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
  roles: string[];
  firstLogin: boolean;
  tokenExpiresAt: string;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9._-]{3,50}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s-]{2,50}$/;
    return nameRegex.test(name);
  };

  const validatePasswordsMatch = (password: string, confirmation: string): boolean => {
    return password === confirmation;
  };
  
  const resetErrors = () => {
    setErrors({});
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    setLoading(true);
    
    const validationErrors: { [key: string]: string } = {};
    
    // Simple validation for login form
    if (!email && !username) {
      validationErrors.loginIdentifier = 'Email or username is required';
    }
    
    if (!password) {
      validationErrors.loginPassword = 'Password is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post<AuthResponse>('http://localhost:8081/api/auth/login', {
        loginIdentifier: email || username, // Send either email or username
        password
      });
      
      // Store auth data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        roles: response.data.roles,
        tokenExpiresAt: response.data.tokenExpiresAt
      }));
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Rivalist!",
      });
      
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ErrorResponse;
        
        if (data.errors) {
          const formattedErrors: { [key: string]: string } = {};
          Object.entries(data.errors).forEach(([key, messages]) => {
            formattedErrors[key] = messages[0];
          });
          setErrors(formattedErrors);
        } else if (data.message) {
          setErrors({ general: data.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
      
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    setLoading(true);
    
    const validationErrors: { [key: string]: string } = {};
    
    // Validation
    if (!validateName(firstName)) {
      validationErrors.firstName = 'First name must be 2-50 characters and contain only letters, spaces or hyphens';
    }
    
    if (!validateName(lastName)) {
      validationErrors.lastName = 'Last name must be 2-50 characters and contain only letters, spaces or hyphens';
    }
    
    if (!validateEmail(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    
    if (!validateUsername(username)) {
      validationErrors.username = 'Username must be 3-50 characters and can contain letters, numbers, dots, underscores, and hyphens';
    }
    
    if (!validatePassword(password)) {
      validationErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters';
    }
    
    if (!validatePasswordsMatch(password, passwordConfirmation)) {
      validationErrors.passwordConfirmation = 'Passwords do not match';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post<AuthResponse>('http://localhost:8081/api/auth/register', {
        firstName,
        lastName,
        email,
        username,
        password,
        passwordConfirmation
      });
      
      // Store auth data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        roles: response.data.roles,
        tokenExpiresAt: response.data.tokenExpiresAt
      }));
      
      toast({
        title: "Registration Successful",
        description: "Welcome to Rivalist!",
      });
      
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ErrorResponse;
        
        if (data.errors) {
          const formattedErrors: { [key: string]: string } = {};
          Object.entries(data.errors).forEach(([key, messages]) => {
            formattedErrors[key] = messages[0];
          });
          setErrors(formattedErrors);
        } else if (data.message) {
          setErrors({ general: data.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
      
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Battle Account</DialogTitle>
          <DialogDescription>
            Login or create an account to start battling!
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form className="space-y-3 py-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="loginIdentifier">Email or Username</Label>
                <Input 
                  id="loginIdentifier" 
                  type="text" 
                  value={email || username}
                  onChange={(e) => {
                    // Try to determine if input is email or username
                    if (e.target.value.includes('@')) {
                      setEmail(e.target.value);
                      setUsername('');
                    } else {
                      setUsername(e.target.value);
                      setEmail('');
                    }
                  }}
                  required
                />
                {errors.loginIdentifier && (
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.loginIdentifier}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <Input 
                  id="loginPassword" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.loginPassword && (
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.loginPassword}
                  </div>
                )}
              </div>
              
              {errors.general && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.general}
                </div>
              )}
              
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form className="space-y-3 py-4" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  {errors.firstName && (
                    <div className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  {errors.lastName && (
                    <div className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email</Label>
                <Input 
                  id="registerEmail" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerUsername">Username</Label>
                <Input 
                  id="registerUsername" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {errors.username && (
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.username}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerPassword">Password</Label>
                <Input 
                  id="registerPassword" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && (
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input 
                  id="passwordConfirmation" 
                  type="password" 
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
                {errors.passwordConfirmation && (
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.passwordConfirmation}
                  </div>
                )}
              </div>
              
              {errors.general && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.general}
                </div>
              )}
              
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
