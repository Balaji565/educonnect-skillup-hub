
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-indigo-700 mb-4">EDUAPP</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Connecting teachers and students for better learning experiences
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Button
          className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => navigate("/teacher-login")}
        >
          Teacher Login
        </Button>
        <Button
          className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700"
          onClick={() => navigate("/student-login")}
        >
          Student Login
        </Button>
      </div>
    </div>
  );
};

export default Index;
