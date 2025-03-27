
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would validate these credentials against a database
    // This is a simple demo authentication
    if (credentials.email === "admin@digitalio.com" && credentials.password === "admin123") {
      toast({
        title: "Login successful",
        description: "Redirecting to admin dashboard",
        variant: "default",
      });
      
      // In a real app, you'd set some authentication state/token here
      localStorage.setItem("isAdminLoggedIn", "true");
      
      // Redirect to admin dashboard
      navigate("/admin-dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 shadow-xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-8">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@digitalio.com"
                value={credentials.email}
                onChange={handleChange}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Demo credentials: admin@digitalio.com / admin123
            </p>
          </div>
          
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Login to Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
