"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThumbsUp, Code, Send, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllQuest } from "@/lib/quest";

export default function SolutionPage() {
  const router = useRouter();
  const [quests, setQuests] = useState<any[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"submit" | "view">("submit");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await getAllQuest(1, 100); // Get all quests for solution page
      
      // Handle new pagination format
      if (response.quests) {
        setQuests(response.quests);
      } else {
        // Fallback for old format
        setQuests(response || []);
      }
    } catch (error) {
      console.error("Failed to fetch quests:", error);
      toast.error("Failed to load quests");
    }
  };

  const handleSubmitSolution = async () => {
    if (!code) {
      toast.error("Please enter your code");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Submit solution to API
      // await submitSolution({ questId: selectedQuest._id, code, explanation });
      
      // For now, add to local state (temporary until backend is ready)
      const username = localStorage.getItem("username") || "Anonymous";
      const newSolution = {
        _id: Date.now().toString(),
        questId: selectedQuest._id,
        code: code,
        explanation: explanation,
        upvotes: 0,
        author: username,
        language: "javascript"
      };
      
      // Store in localStorage temporarily
      const storedSolutions = JSON.parse(localStorage.getItem("solutions") || "[]");
      storedSolutions.push(newSolution);
      localStorage.setItem("solutions", JSON.stringify(storedSolutions));
      
      toast.success("Solution submitted successfully!");
      setCode("");
      setExplanation("");
      setSelectedQuest(null);
    } catch (error) {
      toast.error("Failed to submit solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSolutions = (quest: any) => {
    setSelectedQuest(quest);
    setViewMode("view");
    
    // TODO: Fetch solutions for this quest from API
    // For now, get from localStorage
    const storedSolutions = JSON.parse(localStorage.getItem("solutions") || "[]");
    const questSolutions = storedSolutions.filter((s: any) => s.questId === quest._id);
    
    // Sort by upvotes (highest first)
    questSolutions.sort((a: any, b: any) => b.upvotes - a.upvotes);
    
    setSolutions(questSolutions);
  };

  const handleUpvote = async (solutionId: string) => {
    try {
      // TODO: Upvote solution API
      // For now, update localStorage
      const storedSolutions = JSON.parse(localStorage.getItem("solutions") || "[]");
      const userId = localStorage.getItem("userId");
      
      const updatedSolutions = storedSolutions.map((solution: any) => {
        if (solution._id === solutionId) {
          // Check if user already upvoted
          if (!solution.upvotedBy) {
            solution.upvotedBy = [];
          }
          
          if (solution.upvotedBy.includes(userId)) {
            toast.error("You already upvoted this solution!");
            return solution;
          }
          
          // Add upvote
          solution.upvotes = (solution.upvotes || 0) + 1;
          solution.upvotedBy.push(userId);
          toast.success("Solution upvoted!");
        }
        return solution;
      });
      
      localStorage.setItem("solutions", JSON.stringify(updatedSolutions));
      
      // Refresh the solutions view
      if (selectedQuest) {
        handleViewSolutions(selectedQuest);
      }
    } catch (error) {
      toast.error("Failed to upvote");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-blue-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">Quest Solutions</h1>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-blue-500 text-blue-600"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-4">
          {/* Quest List */}
          {quests.length === 0 ? (
            <Card className="border-blue-200">
              <CardContent className="py-8 text-center text-gray-500">
                No quests available
              </CardContent>
            </Card>
          ) : (
            quests.map((quest) => (
              <Card key={quest._id} className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900 mb-2">
                        {quest.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{quest.description}</p>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {quest.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          XP: {quest.points}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleViewSolutions(quest)}
                        variant="outline"
                        className="border-blue-500 text-blue-600"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Solutions
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedQuest(quest);
                          setViewMode("submit");
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Submit Solution
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Submit Solution Modal */}
        <Dialog open={selectedQuest !== null && viewMode === "submit"} onOpenChange={() => setSelectedQuest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Solution for: {selectedQuest?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Code Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Your Code *
                </label>
                <Textarea
                  placeholder="Enter your solution code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-48 font-mono text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Explanation (Optional)
                </label>
                <Textarea
                  placeholder="Explain your approach..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="h-24"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedQuest(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitSolution}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Solution"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Solutions Modal */}
        <Dialog open={selectedQuest !== null && viewMode === "view"} onOpenChange={() => setSelectedQuest(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Solutions for: {selectedQuest?.title}
                <span className="text-sm text-gray-500 ml-2">
                  ({solutions.length} solution{solutions.length !== 1 ? 's' : ''})
                </span>
              </DialogTitle>
            </DialogHeader>
            
            {/* Scrollable Solutions Container */}
            <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2 space-y-4">
              {solutions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No solutions yet. Be the first to submit!
                </p>
              ) : (
                solutions.map((solution, index) => (
                  <div
                    key={solution._id}
                    className="p-4 border-2 border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-white hover:shadow-md transition-shadow"
                  >
                    {/* Header with Author and Rank */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">{solution.author}</p>
                          <p className="text-xs text-gray-500">{solution.language}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleUpvote(solution._id)}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-semibold">{solution.upvotes}</span>
                      </Button>
                    </div>

                    {/* Code Block */}
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto mb-3 border border-gray-700">
                      <code>{solution.code}</code>
                    </pre>

                    {/* Explanation */}
                    {solution.explanation && (
                      <div className="p-3 bg-white rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-500 mb-1">Explanation:</p>
                        <p className="text-sm text-gray-700">{solution.explanation}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
