
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { FileUploader } from "@/components/FileUploader";
import { QuizCreator } from "@/components/QuizCreator";
import { AttendanceTracker } from "@/components/AttendanceTracker";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EDUAPP - Teacher Dashboard</h1>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-indigo-600"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="quizzes">Create Quiz</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials" className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Upload Study Materials</h2>
            <FileUploader />
          </TabsContent>
          
          <TabsContent value="quizzes" className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Create a Quiz</h2>
            <QuizCreator />
          </TabsContent>
          
          <TabsContent value="attendance" className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Attendance Tracker</h2>
            <AttendanceTracker />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
