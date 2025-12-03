"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const onSubmit = async (data: QuestForm) => {
    // simulate API call
    console.log("Creating Quest:", {
      ...data,
      xpReward: Number(data.xpReward),
    });

    // reset form after creation
    reset();
  };

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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "+ Create Quest"}
            </Button>
          </form>
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
    </div>
  );
}
