
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock data
const availableQuizzes = [
  { 
    id: "1", 
    title: "Biology Midterm", 
    accessCode: "BIO123", 
    questions: [
      { id: 1, text: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], correctAnswer: 1 },
      { id: 2, text: "Which of these is NOT a plant cell structure?", options: ["Cell wall", "Chloroplast", "Flagellum", "Vacuole"], correctAnswer: 2 }
    ]
  }
];

export const QuizList = () => {
  const [accessCode, setAccessCode] = useState("");
  const [quizzes, setQuizzes] = useState<Array<{id: string, title: string}>>([]);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode) {
      toast({
        title: "Missing access code",
        description: "Please enter an access code",
        variant: "destructive"
      });
      return;
    }

    // Check if the code matches any quiz
    const matchingQuiz = availableQuizzes.find(
      quiz => quiz.accessCode === accessCode
    );

    if (matchingQuiz) {
      // Check if quiz is already in the list
      if (!quizzes.some(q => q.id === matchingQuiz.id)) {
        setQuizzes([...quizzes, { id: matchingQuiz.id, title: matchingQuiz.title }]);
        toast({
          title: "Success!",
          description: `You now have access to "${matchingQuiz.title}"`,
        });
      } else {
        toast({
          title: "Already accessed",
          description: "You already have access to this quiz",
        });
      }
    } else {
      toast({
        title: "Invalid code",
        description: "The access code you entered is not valid",
        variant: "destructive"
      });
    }
    
    setAccessCode("");
  };
  
  const startQuiz = (id: string) => {
    const quiz = availableQuizzes.find(q => q.id === id);
    if (quiz) {
      setCurrentQuiz(quiz);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      setIsQuizOpen(true);
    }
  };
  
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };
  
  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };
  
  const calculateResults = () => {
    let correct = 0;
    currentQuiz.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    setScore({ correct, total: currentQuiz.questions.length });
    setShowResults(true);
  };
  
  const closeQuiz = () => {
    setIsQuizOpen(false);
    setCurrentQuiz(null);
  };

  return (
    <div>
      <form onSubmit={handleAccessSubmit} className="mb-8 space-y-4">
        <div>
          <Label htmlFor="quizAccessCode">Enter Access Code</Label>
          <div className="flex gap-2">
            <Input
              id="quizAccessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="e.g., BIO123"
              className="flex-1"
            />
            <Button type="submit">Access</Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">Enter the code provided by your teacher to access quizzes.</p>
        </div>
      </form>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Quizzes</h3>
        {quizzes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <h4 className="font-medium text-lg">{quiz.title}</h4>
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => startQuiz(quiz.id)}
                    variant="default"
                    size="sm"
                  >
                    Start Quiz
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No quizzes accessed yet. Enter an access code to view quizzes.</p>
            <p className="text-sm text-gray-400 mt-1">Try using code: BIO123</p>
          </div>
        )}
      </div>
      
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentQuiz?.title}</DialogTitle>
          </DialogHeader>
          
          {currentQuiz && !showResults ? (
            <div className="py-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">
                  Question {currentQuestion + 1} of {currentQuiz.questions.length}
                </div>
                <h3 className="text-lg font-medium">{currentQuiz.questions[currentQuestion].text}</h3>
              </div>
              
              <div className="space-y-2">
                {currentQuiz.questions[currentQuestion].options.map((option: string, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedAnswers[currentQuestion] === index ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={nextQuestion}
                  className="w-full"
                  disabled={selectedAnswers[currentQuestion] === undefined}
                >
                  {currentQuestion < currentQuiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
            </div>
          ) : showResults ? (
            <div className="py-4">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Quiz Results</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {score.correct} / {score.total}
                </div>
                <p className="mb-6">
                  You got {score.correct} out of {score.total} questions correct!
                </p>
                <Button onClick={closeQuiz}>Close</Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
