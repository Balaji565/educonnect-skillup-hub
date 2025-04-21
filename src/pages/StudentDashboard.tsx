
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { MaterialsList } from "@/components/MaterialsList";
import { QuizList } from "@/components/QuizList";

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EDUAPP - Student Dashboard</h1>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-emerald-600"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials" className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Available Study Materials</h2>
            <MaterialsList />
          </TabsContent>
          
          <TabsContent value="quizzes" className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
            <QuizList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
