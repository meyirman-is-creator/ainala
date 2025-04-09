"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaPlus, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setUserIssues,
  setStatusFilter,
  setCategoryFilter,
  clearFilters,
} from "@/store/slices/issues-slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import IssueCard from "@/components/issues/issue-card";
import { Issue, IssueStatus, IssueCategory } from "@/types/issue";

// Mock data for issues
const mockIssues: Issue[] = [
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
  {
    id: "4",
    title: "Water main leak",
    description: "Water leaking from main pipe onto the sidewalk",
    category: "water-supply",
    status: "progress",
    createdAt: "2023-04-01T15:20:00.000Z",
    updatedAt: "2023-04-02T10:10:00.000Z",
    userId: "user1",
    userName: "Antonio Banderas",
    photos: ["/images/water-leak.jpg"],
    likes: 12,
    responsible: {
      id: "admin2",
      name: "City Water Department",
    },
    comments: [],
  },
  {
    id: "5",
    title: "Graffiti on public building",
    description: "Offensive graffiti on the wall of the community center",
    category: "safety",
    status: "to-do",
    createdAt: "2023-04-06T08:45:00.000Z",
    updatedAt: "2023-04-06T08:45:00.000Z",
    userId: "user1",
    userName: "Antonio Banderas",
    photos: ["/images/graffiti.jpg"],
    likes: 2,
    comments: [],
  },
  {
    id: "6",
    title: "Bus stop damage",
    description: "Bus stop shelter has broken glass panels",
    category: "public-transport",
    status: "rejected",
    createdAt: "2023-03-25T11:20:00.000Z",
    updatedAt: "2023-03-26T14:30:00.000Z",
    userId: "user1",
    userName: "Antonio Banderas",
    photos: ["/images/bus-stop.jpg"],
    likes: 7,
    adminComment:
      "This is under the jurisdiction of the transit authority. Please report directly to them.",
    comments: [],
  },
];

const categories: { value: IssueCategory; label: string }[] = [
  { value: "roads", label: "Roads" },
  { value: "energy-supply", label: "Energy Supply" },
  { value: "water-supply", label: "Water Supply" },
  { value: "network", label: "Network" },
  { value: "public-transport", label: "Public Transport" },
  { value: "ecology", label: "Ecology" },
  { value: "safety", label: "Safety" },
  { value: "csc", label: "Citizens Service Center (CSC)" },
];

export default function MyIssuesPage() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const userIssues = useAppSelector((state) => state.issues.userIssues);
  const filters = useAppSelector((state) => state.issues.filters);

  const [activeTab, setActiveTab] = useState<IssueStatus | "all">("all");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // In a real app, this would fetch data from an API
    dispatch(setUserIssues(mockIssues));
  }, [dispatch]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as IssueStatus | "all");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCategoryFilter(null));

    // In a real app, we would make an API call with the search query
    // For this demo, we'll just set the search query in Redux
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchQuery("");
  };

  const filteredIssues = userIssues.filter((issue) => {
    // Filter by status (tab)
    const matchesStatus = activeTab === "all" || issue.status === activeTab;

    // Filter by category
    const matchesCategory =
      !filters.category || issue.category === filters.category;

    // Filter by search query
    const matchesQuery =
      searchQuery === "" ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesQuery;
  });

  const issueCountByStatus = (status: IssueStatus | "all") => {
    if (status === "all") {
      return userIssues.length;
    }
    return userIssues.filter((issue) => issue.status === status).length;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">My Issues</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild className="bg-ainala-blue hover:bg-blue-700">
            <Link href="/add-issues">
              <FaPlus className="mr-2" />
              Add Issue
            </Link>
          </Button>
          <Dialog
            open={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <FaFilter className="mr-2" />
                Filters
                {filters.category && (
                  <Badge className="ml-2 bg-ainala-blue">
                    {filters.category && `1`}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Issues</DialogTitle>
                <DialogDescription>
                  Narrow down your issue list by applying filters.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category || ""}
                    onValueChange={(value) =>
                      dispatch(
                        setCategoryFilter((value as IssueCategory) || null)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mr-auto"
                >
                  <FaTimes className="mr-2" />
                  Clear Filters
                </Button>
                <Button
                  onClick={() => setIsFilterDialogOpen(false)}
                  className="bg-ainala-blue hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative w-full md:max-w-xl">
          <Input
            type="search"
            placeholder="Search issues by title or description"
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-gray-400" />
          </div>
        </form>
      </div>

      <div className="mb-2">
        {filters.category && (
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600 mr-2">Active filters:</span>
            <Badge className="bg-ainala-blue mr-2 flex items-center">
              {categories.find((c) => c.value === filters.category)?.label ||
                filters.category}
              <button
                className="ml-1 hover:text-gray-200"
                onClick={() => dispatch(setCategoryFilter(null))}
              >
                <FaTimes size={10} />
              </button>
            </Badge>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={handleClearFilters}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            All
            <Badge className="ml-2 bg-gray-200 text-gray-700">
              {issueCountByStatus("all")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="to-do"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            To Do
            <Badge className="ml-2 bg-gray-200 text-gray-700">
              {issueCountByStatus("to-do")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            In Progress
            <Badge className="ml-2 bg-gray-200 text-gray-700">
              {issueCountByStatus("progress")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="done"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            Done
            <Badge className="ml-2 bg-gray-200 text-gray-700">
              {issueCountByStatus("done")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            Rejected
            <Badge className="ml-2 bg-gray-200 text-gray-700">
              {issueCountByStatus("rejected")}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No issues found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or create a new issue.
                </p>
                <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                  <Link href="/add-issues">
                    <FaPlus className="mr-2" />
                    Add New Issue
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="to-do" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No issues in "To Do" status
                </h3>
                <p className="text-gray-500 mb-6">
                  Issues waiting for review will appear here.
                </p>
                <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                  <Link href="/add-issues">
                    <FaPlus className="mr-2" />
                    Add New Issue
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No issues in progress
                </h3>
                <p className="text-gray-500">
                  Issues that have been accepted and are being worked on will
                  appear here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="done" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No resolved issues
                </h3>
                <p className="text-gray-500">
                  Completed issues will appear here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No rejected issues
                </h3>
                <p className="text-gray-500">
                  Issues that couldn't be processed will appear here with the
                  reason for rejection.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
