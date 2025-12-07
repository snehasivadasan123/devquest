"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Zap, Target, Code, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserProgress } from "@/lib/progress";
import { getMe } from "@/lib/api";
import { getAllQuest } from "@/lib/quest";

export default function DevQuestDashboard() {
  const [user, setUser] = useState({
  name: "",
  level: 1,
  currentXP: 0,
  xpToNextLevel: 1000,
  totalQuests: 0,
  completedQuests: 0,
});

  

  const badges = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first quest",
      icon: Target,
      color: "text-blue-600",
      earned: user.completedQuests >= 1,
    },
    {
      id: 2,
      name: "Quest Master",
      description: "Complete 5 quests",
      icon: Flame,
      color: "text-blue-600",
      earned: user.completedQuests >= 5,
    },
    {
      id: 3,
      name: "XP Hunter",
      description: "Earn 500 XP",
      icon: Zap,
      color: "text-blue-600",
      earned: user.currentXP >= 500,
    },
  ];

  const progressPercentage = (user.currentXP / user.xpToNextLevel) * 100;
  const router = useRouter();

  useEffect(() => {
  async function fetchData() {
    try {
      const userData = await getMe();
      const questResponse = await getAllQuest(1, 100); // Get all quests
      
      // Handle new pagination format
      const allQuests = questResponse.quests || questResponse;
      
      console.log("User data:", userData);
      console.log("Total quests:", allQuests.length);
      
      setUser({
        name: userData.user.username,
        level: userData.user.level,
        currentXP: userData.user.points,
        xpToNextLevel: userData.user.level * 1000,
        totalQuests: allQuests.length,
        completedQuests: userData.user.completedQuests.length,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  fetchData();
}, []);


  function handlelogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-blue-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">DevQuest</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                router.push("/quest");
              }}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Manage Quest
            </Button>
            <Button
              onClick={() => router.push("/solution")}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Solution
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-blue-900 font-medium">{user.name}</span>
              <Button
                variant="ghost"
                onClick={handlelogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Level Progress Card */}
          <Card className="col-span-full bg-white border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Level Progress
              </CardTitle>
              <CardDescription className="text-gray-600">
                Keep questing to reach the next level!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {user.level}
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-blue-900">
                        Level {user.level}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.currentXP} / {user.xpToNextLevel} XP
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {user.xpToNextLevel - user.currentXP}
                    </p>
                    <p className="text-sm text-gray-600">XP to next level</p>
                  </div>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-3 bg-blue-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-white border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg">
                Total Quests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">
                {user.totalQuests}
              </p>
              <p className="text-sm text-gray-600 mt-2">Quests available</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">
                {user.completedQuests}
              </p>
              <p className="text-sm text-gray-600 mt-2">Quests finished</p>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card className="col-span-full bg-white border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Badges & Achievements
              </CardTitle>
              <CardDescription className="text-gray-600">
                Earn badges by completing special challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        badge.earned
                          ? "bg-blue-50 border-blue-300 hover:bg-blue-100"
                          : "bg-white border-gray-200 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          badge.earned
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            badge.earned ? "text-white" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium text-center ${
                          badge.earned ? "text-blue-900" : "text-gray-400"
                        }`}
                      >
                        {badge.name}
                      </span>
                      {badge.earned && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-600 text-white border-blue-600"
                        >
                          Earned
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
function setUser(arg0: { name: any; level: any; currentXP: any; xpToNextLevel: number; completedQuests: any; }) {
  throw new Error("Function not implemented.");
}

