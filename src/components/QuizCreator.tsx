
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";

export const QuizCreator = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: ["", "", "", ""], correctOption: 0 }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [createdQuizzes, setCreatedQuizzes] = useState<Array<{id: string, title: string, questionCount: number, accessCode: string}>>([
    { id: "1", title: "Biology Midterm", questionCount: 10, accessCode: "BIO123" }
  ]);

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: "",
        options: ["", "", "", ""],
        correctOption: 0
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    } else {
      toast({
        title: "Cannot remove",
        description: "A quiz must have at least one question",
        variant: "destructive"
      });
    }
  };

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizTitle) {
      toast({
        title: "Missing quiz title",
        description: "Please provide a title for your quiz",
        variant: "destructive"
      });
      return;
    }

    // Validate questions
    const invalidQuestions = questions.filter(
      q => !q.text || q.options.some(opt => !opt)
    );

    if (invalidQuestions.length > 0) {
      toast({
        title: "Incomplete questions",
        description: "Please fill in all questions and their options",
        variant: "destructive"
      });
      return;
    }

    // In a real app, save quiz to database
    const newCode = generateAccessCode();
    setAccessCode(newCode);
    
    const newQuiz = {
      id: Date.now().toString(),
      title: quizTitle,
      questionCount: questions.length,
      accessCode: newCode
    };
    
    setCreatedQuizzes([...createdQuizzes, newQuiz]);
    setIsOpen(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="quizTitle">Quiz Title</Label>
          <Input
            id="quizTitle"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="e.g., Chapter 3 Assessment"
            className="mt-1"
          />
        </div>

        <div className="space-y-8">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Question {qIndex + 1}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                  <Input
                    id={`question-${qIndex}`}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Enter your question here"
                    className="mt-1"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Answer Options</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctOption === oIndex}
                        onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                        className="mr-1"
                      />
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" /> Add Question
          </Button>
          <Button type="submit">Create Quiz</Button>
        </div>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Created Successfully!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Your quiz has been created. Share this access code with your students:</p>
            <div className="bg-gray-100 p-4 rounded-md text-center">
              <span className="text-2xl font-mono font-bold">{accessCode}</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Students will need this code to access the quiz.</p>
          </div>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Created Quizzes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Questions</th>
                <th className="py-3 px-4 text-left">Access Code</th>
              </tr>
            </thead>
            <tbody>
              {createdQuizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{quiz.title}</td>
                  <td className="py-3 px-4">{quiz.questionCount}</td>
                  <td className="py-3 px-4">
                    <code className="bg-gray-100 px-2 py-1 rounded">{quiz.accessCode}</code>
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
