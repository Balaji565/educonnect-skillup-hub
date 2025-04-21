
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";

export const AttendanceTracker = () => {
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<Array<{id: string, className: string, date: string, accessCode: string, studentCount: number}>>([
    { id: "1", className: "Mathematics 101", date: "2025-04-15", accessCode: "MTH101", studentCount: 25 },
    { id: "2", className: "Physics Lab", date: "2025-04-16", accessCode: "PHYS22", studentCount: 18 }
  ]);

  const handleClassCreation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!className || !date) {
      toast({
        title: "Missing information",
        description: "Please provide both class name and date",
        variant: "destructive"
      });
      return;
    }

    // Generate a random access code
    const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setAccessCode(newCode);
    
    // In a real app, this would save to a database
    const newSession = {
      id: Date.now().toString(),
      className,
      date,
      accessCode: newCode,
      studentCount: 0
    };
    
    setSessions([...sessions, newSession]);
    setIsOpen(true);
  };

  return (
    <div>
      <form onSubmit={handleClassCreation} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="className">Class Name</Label>
          <Input
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g., Biology 101"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <Button type="submit">Create Attendance Session</Button>
      </form>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance Session Created!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Your attendance session has been created. Share this code with your students:</p>
            <div className="bg-gray-100 p-4 rounded-md text-center">
              <span className="text-2xl font-mono font-bold">{accessCode}</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Students will need this code to mark their attendance.</p>
          </div>
          <Button onClick={() => {
            setIsOpen(false);
            setClassName("");
            setDate("");
          }}>Close</Button>
        </DialogContent>
      </Dialog>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Attendance Sessions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Class Name</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Access Code</th>
                <th className="py-3 px-4 text-left">Students</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{session.className}</td>
                  <td className="py-3 px-4">{session.date}</td>
                  <td className="py-3 px-4">
                    <code className="bg-gray-100 px-2 py-1 rounded">{session.accessCode}</code>
                  </td>
                  <td className="py-3 px-4">{session.studentCount}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
