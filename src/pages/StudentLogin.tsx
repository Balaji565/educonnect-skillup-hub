
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const StudentLogin = () => {
  const [accessCode, setAccessCode] = useState("");
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would validate the access code with a backend
    if (accessCode && studentId) {
      // Mock successful login
      toast({
        title: "Access granted!",
        description: "Redirecting to student dashboard...",
      });
      setTimeout(() => navigate("/student-dashboard"), 1000);
    } else {
      toast({
        title: "Login failed",
        description: "Please enter both access code and student ID",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">Student Login</h1>
          <p className="text-gray-600 mt-2">Access your learning materials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input 
              id="studentId"
              type="text" 
              placeholder="Enter your student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input 
              id="accessCode"
              type="text" 
              placeholder="Enter the code provided by your teacher"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Access Materials
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            className="text-emerald-600"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
