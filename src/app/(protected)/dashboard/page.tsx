"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaPlus, FaChevronRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUserIssues } from "@/store/slices/issues-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IssueCard from "@/components/issues/issue-card";
import { Issue } from "@/types/issue";

// Mock data for statistics and charts
const mockStats = {
  daily: 2,
  weekly: 8,
  monthly: 15,
};

const mockCalendarData = [
  { date: "2023-04-01", issues: 2, resolved: 1 },
  { date: "2023-04-02", issues: 1, resolved: 1 },
  { date: "2023-04-03", issues: 0, resolved: 0 },
  { date: "2023-04-04", issues: 3, resolved: 2 },
  { date: "2023-04-05", issues: 1, resolved: 0 },
  { date: "2023-04-06", issues: 2, resolved: 2 },
  { date: "2023-04-07", issues: 0, resolved: 0 },
];

// Mock data for recent issues
const mockRecentIssues: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "Large pothole causing damage to vehicles",
    category: "roads",
    status: "to-do",
    createdAt: "2023-04-05T14:48:00.000Z",
    updatedAt: "2023-04-05T14:48:00.000Z",
    userId: "user1",
    userName: "Antonio Banderas",
    photos: ["/images/pothole.jpg"],
    likes: 5,
    comments: [],
  },
  {
    id: "2",
    title: "Traffic light malfunction",
    description:
      "Traffic light stuck on red at the intersection of 5th and Main",
    category: "safety",
    status: "progress",
    createdAt: "2023-04-03T10:30:00.000Z",
    updatedAt: "2023-04-04T12:15:00.000Z",
    userId: "user1",
    userName: "Antonio Banderas",
    photos: ["/images/traffic-light.jpg"],
    likes: 8,
    responsible: {
      id: "admin1",
      name: "City Traffic Department",
    },
    comments: [],
  },
  {
    id: "3",
    title: "Broken street lamp",
    description: "Street lamp not working at night, creating safety issues",
    category: "energy-supply",
    status: "done",
    createdAt: "2023-03-28T09:12:00.000Z",
    updatedAt: "2023-04-01T16:45:00.000Z",
    userId: "user1",
    userName: "Antonio Banderas",
    photos: ["/images/street-lamp.jpg"],
    resultPhoto: "/images/fixed-lamp.jpg",
    likes: 3,
    comments: [],
  },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const userIssues = useAppSelector((state) => state.issues.userIssues);
  const [currentDay, setCurrentDay] = useState(new Date().getDay());

  useEffect(() => {
    // In a real app, this would fetch data from an API
    dispatch(setUserIssues(mockRecentIssues));
  }, [dispatch]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i + 1); // Start from Monday
    return date.getDate();
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Ainala</h1>
          <p className="text-gray-600">View progress and insights</p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-ainala-blue hover:bg-blue-700 mt-4 md:mt-0"
        >
          <Link href="/add-issues">
            <FaPlus className="mr-2" />
            ADD ISSUE
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Daily Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-ainala-blue">
              {mockStats.daily}
            </div>
            <p className="text-sm text-gray-500">issues resolved today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Weekly Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-ainala-blue">
              {mockStats.weekly}
            </div>
            <p className="text-sm text-gray-500">issues resolved this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Monthly Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-ainala-blue">
              {mockStats.monthly}
            </div>
            <p className="text-sm text-gray-500">issues resolved this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {days.map((day, index) => (
              <div key={day} className="text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {dates.map((date, index) => (
              <div
                key={index}
                className={`
                  py-2 rounded-full text-sm 
                  ${
                    index + 1 === currentDay
                      ? "bg-ainala-blue text-white font-medium"
                      : ""
                  }
                `}
              >
                {date}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Issue Details</h2>
          <Link
            href="/my-issues"
            className="text-ainala-blue flex items-center hover:underline"
          >
            View all issues <FaChevronRight className="ml-1" size={12} />
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            {userIssues.length > 0 ? (
              <div className="space-y-4">
                {userIssues.slice(0, 3).map((issue) => (
                  <div
                    key={issue.id}
                    className="pb-4 border-b border-gray-100 last:border-0"
                  >
                    <IssueCard issue={issue} compact />
                  </div>
                ))}
                {userIssues.length > 3 && (
                  <div className="text-center">
                    <Button asChild variant="outline">
                      <Link href="/my-issues">View all issues</Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">
                  You haven't reported any issues yet
                </p>
                <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                  <Link href="/add-issues">
                    <FaPlus className="mr-2" />
                    Report your first issue
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problems by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <div className="flex h-full items-end space-x-6">
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-ainala-blue h-32 w-full rounded-t"></div>
                <span className="mt-2 text-sm">Pending</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-ainala-blue h-40 w-full rounded-t"></div>
                <span className="mt-2 text-sm">Resolved</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-ainala-blue h-48 w-full rounded-t"></div>
                <span className="mt-2 text-sm">In progress</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
