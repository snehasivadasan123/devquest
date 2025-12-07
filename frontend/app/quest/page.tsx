"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuest, deleteQuestById, updateQuestById } from "@/lib/quest";
import { createOrUpdateProgress } from "@/lib/progress";
import { getMe } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllQuest } from "@/lib/quest";
import { Pencil, Trash } from "lucide-react";
import ModalHandle from "./modalhandle";
import { toast } from "sonner";

/* ---------------------- Validation Schema ---------------------- */
const QuestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  xpReward: z
    .string()
    .min(1, "XP reward is required")
    .refine((val) => {
      const n = Number(val);
      return !Number.isNaN(n) && n > 0;
    }, "XP must be a number greater than 0"),
});

type QuestForm = z.infer<typeof QuestSchema>;

export default function ManageQuestPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestForm>({
    resolver: zodResolver(QuestSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      xpReward: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdQuest, setCreatedQuest] = useState<any>(null);
  const [allQuests, setAllQuests] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editQuest, setEditQuest] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [userProgress, setUserProgress] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuests, setTotalQuests] = useState(0);

  const fetchQuests = async (page = 1) => {
    try {
      const response = await getAllQuest(page, 5); // 5 quests per page
      console.log("Quests fetched in component:", response);
      
      if (response.quests) {
        setAllQuests(response.quests);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setTotalQuests(response.pagination.totalQuests);
      } else {
        // Fallback for old API format
        setAllQuests(response || []);
      }
    } catch (error) {
      console.error("Failed to fetch quests:", error);
    }
  };

  useEffect(() => {
    fetchQuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: QuestForm) => {
    console.log("Form Data Submitted:", data);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      // Get user ID from token (you'll need to decode it or get from context)
      const createdBy = "temp-user-id"; // TODO: Get actual user ID from auth context

      const response = await createQuest({
        title: data.title,
        description: data.description,
        points: Number(data.xpReward),
        difficulty: data.difficulty as "easy" | "medium" | "hard",
      });

      setSuccess("Quest created successfully!");
      setCreatedQuest(response.quest);

      reset();
      fetchQuests();
    } catch (err: any) {
      setError(err.message || "Failed to create quest");
    }
  };

  function handleEdit(quest: any): void {
    console.log("Edit quest:");
    setEditQuest(quest)
    setEditOpen (true);
  }

 async function handleDelete(_id: string) {
  try {
    const confirmed = confirm("Are you sure you want to delete this quest?");
    if (!confirmed) return;

    const response = await deleteQuestById(_id); 
    console.log("Deleted quest:", response);

    fetchQuests();
  } catch (error: any) {
    console.error("Failed to delete quest:", error.message || error);
    alert("Failed to delete quest: " + (error.message || "Unknown error"));
  }
}

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getMe();
        setUserProgress(userData.user.completedQuests);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="relative min-h-screen px-6 pt-6 pb-28 flex justify-center bg-white">
      {/* Wider + Shorter Card */}
      <Card className="w-full max-w-6xl shadow-md border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-blue-700 text-center">
            Create New Quest
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                placeholder="Enter quest title"
                {...register("title")}
                className="border-blue-200"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                placeholder="Enter quest description"
                {...register("description")}
                className="h-20 border-blue-200"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Difficulty + XP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Difficulty
                </label>

                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className="text-red-600 text-sm">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>

              {/* XP Reward */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  XP Reward
                </label>
                <Input
                  type="number"
                  placeholder="Enter XP reward"
                  {...register("xpReward")}
                  className="border-blue-200"
                  disabled={isSubmitting}
                />
                {errors.xpReward && (
                  <p className="text-red-600 text-sm">
                    {errors.xpReward.message}
                  </p>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "+ Create Quest"}
            </Button>
          </form>

          {allQuests.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-700">
                All Quests
              </h3>
              <div className="space-y-3 mt-3">
                {allQuests.map((quest: any) => {
                  const isCompleted = userProgress.includes(quest._id);
                  
                  return (
                  <div
                    key={quest._id}
                    className="p-3 border border-blue-200 rounded-md bg-blue-50"
                  >
                    {/* Title + Actions in same line */}
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{quest.title}</p>

                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(quest)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(quest._id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mt-1">
                      {quest.description}
                    </p>

                    <span className="text-xs text-green-600">
                      XP: {quest.points} | Difficulty: {quest.difficulty}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
  <label className="text-sm text-gray-700">Status:</label>
  <Select
  value={isCompleted ? "complete" : "pending"}
  onValueChange={async (newStatus) => {
    try {
      // 1. Update quest status
      const updatedData = { status: newStatus };
      await updateQuestById(quest._id, updatedData);

      // 2. Update user progress based on status
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        toast.error("Please login first");
        return;
      }
      
      if (newStatus === "complete") {
        // Mark as complete
        await createOrUpdateProgress({
          userId: userId,
          questId: quest._id,
          completed: true,
          pointsEarned: quest.points
        });
        
        // Update local state to add to completed list
        setUserProgress((prev) => [...prev, quest._id]);
        
        toast.success("Quest completed! XP added!");
      } else {
        // Mark as pending (uncomplete)
        await createOrUpdateProgress({
          userId: userId,
          questId: quest._id,
          completed: false,
          pointsEarned: 0
        });
        
        // Update local state to remove from completed list
        setUserProgress((prev) => prev.filter(id => id !== quest._id));
        
        toast.success("Quest marked as pending");
      }

      // 3. Update quest list (optional, for quest status field)
      setAllQuests((prev) =>
        prev.map((q) =>
          q._id === quest._id ? { ...q, status: newStatus } : q
        )
      );
      
    } catch (error: any) {
      console.error("Failed to update:", error);
      toast.error("Failed to update status");
    }
  }}
>

    <SelectTrigger className="border-blue-200">
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="complete">Complete</SelectItem>
    </SelectContent>
  </Select>
</div>

                  </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-blue-200">
                  <Button
                    onClick={() => fetchQuests(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-blue-500 text-blue-600"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => fetchQuests(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={currentPage === page ? "bg-blue-600" : "border-blue-500 text-blue-600"}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => fetchQuests(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-blue-500 text-blue-600"
                  >
                    Next
                  </Button>
                  
                  <span className="text-sm text-gray-600 ml-4">
                    Total: {totalQuests} quests
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom-right fixed button (outside card) */}
      <div className="fixed bottom-6 ">
        <Button
          type="button"
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 text-sm rounded-md"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
      <ModalHandle
  open={editOpen}
  onClose={() => setEditOpen(false)}
  quest={editQuest}
  onUpdated={fetchQuests}
/>
    </div>
    
  );
}
