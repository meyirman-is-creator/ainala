"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaTimes,
  FaPencilAlt,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIssues, updateIssue } from "@/store/slices/issues-slice";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Issue, IssueStatus } from "@/types/issue";
import { showToast } from "@/store/slices/ui-slice";

// Mock data for issues
const mockIssues: Issue[] = Array.from({ length: 20 }, (_, i) => ({
  id: `issue-${i + 1}`,
  title: `Issue ${i + 1}`,
  description: `Description for issue ${i + 1}`,
  category: [
    "roads",
    "energy-supply",
    "water-supply",
    "network",
    "public-transport",
    "ecology",
    "safety",
    "csc",
  ][Math.floor(Math.random() * 8)] as any,
  status: ["to-do", "progress", "done", "rejected"][
    Math.floor(Math.random() * 4)
  ] as IssueStatus,
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  ).toISOString(),
  updatedAt: new Date().toISOString(),
  userId: "user1",
  userName: "Antonio Banderas",
  photos: ["/images/issue.jpg"],
  likes: Math.floor(Math.random() * 50),
  comments: [],
  location: {
    latitude: 0,
    longitude: 0,
    address: "Kazakhstan, 09:30",
  },
}));

export default function AdminAllIssues() {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const issues = useAppSelector((state) => state.issues.issues);

  const [activeTab, setActiveTab] = useState("issues");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 6;

  useEffect(() => {
    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    // In a real app, this would fetch data from an API
    dispatch(setIssues(mockIssues));
  }, [dispatch, router, session]);

  // Filter issues based on tab and search
  const filteredIssues = issues.filter((issue) => {
    const matchesTab =
      (activeTab === "issues" && issue.status === "to-do") ||
      (activeTab === "in-progress" && issue.status === "progress") ||
      (activeTab === "done-issues" && issue.status === "done") ||
      (activeTab === "rejected" && issue.status === "rejected");

    const matchesSearch =
      searchQuery === "" ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (issue: Issue, newStatus: IssueStatus) => {
    // In a real app, this would call an API to update the issue
    const updatedIssue = { ...issue, status: newStatus };

    if (newStatus === "rejected") {
      setSelectedIssue(issue);
      setIsRejectDialogOpen(true);
      return;
    }

    dispatch(updateIssue(updatedIssue));
    dispatch(
      showToast({
        message: `Issue status updated to ${newStatus}`,
        type: "success",
      })
    );
  };

  const handleAccept = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDialogOpen(true);
  };

  const confirmAccept = () => {
    if (selectedIssue) {
      const updatedIssue = {
        ...selectedIssue,
        status: "progress",
        responsible: {
          id: "admin1",
          name: "City Department",
        },
        // In a real app, we would set the deadline based on dialog input
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      dispatch(updateIssue(updatedIssue));
      dispatch(
        showToast({
          message: "Issue accepted and moved to In Progress",
          type: "success",
        })
      );
      setIsDialogOpen(false);
    }
  };

  const confirmReject = () => {
    if (selectedIssue) {
      const updatedIssue = {
        ...selectedIssue,
        status: "rejected",
        adminComment: rejectReason || "Rejected by administrator",
      };

      dispatch(updateIssue(updatedIssue));
      dispatch(
        showToast({
          message: "Issue rejected",
          type: "info",
        })
      );
      setIsRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  const getStatusCount = (status: IssueStatus) => {
    return issues.filter((issue) => issue.status === status).length;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="mb-6">
        <div className="relative w-full md:max-w-md">
          <Input
            type="search"
            placeholder="Report urban issues, add photos and tags"
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="issues"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger
            value="issues"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            Issues
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
              {getStatusCount("to-do")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            In Progress
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
              {getStatusCount("progress")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="done-issues"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            Done Issues
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
              {getStatusCount("done")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white"
          >
            Rejected
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
              {getStatusCount("rejected")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="mt-0">
          <div className="space-y-4">
            {paginatedIssues.length > 0 ? (
              paginatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {issue.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{issue.userName}</h3>
                        <p className="text-sm text-gray-500">Shymkent</p>
                      </div>
                    </div>
                    <div className="my-1">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {issue.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {issue.location?.address}
                    </div>
                  </div>

                  <div className="flex space-x-2 self-end md:self-center">
                    <Button
                      onClick={() => handleAccept(issue)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(issue, "rejected")}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No issues found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-0">
          <div className="space-y-4">
            {paginatedIssues.length > 0 ? (
              paginatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {issue.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{issue.userName}</h3>
                        <p className="text-sm text-gray-500">Shymkent</p>
                      </div>
                    </div>
                    <div className="my-1">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {issue.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {issue.location?.address}
                    </div>
                  </div>

                  <div className="flex space-x-2 self-end md:self-center">
                    <Button
                      onClick={() => handleStatusChange(issue, "done")}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <FaCheck className="mr-2" />
                      Mark as Done
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        /* Edit functionality */
                      }}
                    >
                      <FaPencilAlt />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No issues in progress</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="done-issues" className="mt-0">
          <div className="space-y-4">
            {paginatedIssues.length > 0 ? (
              paginatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {issue.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{issue.userName}</h3>
                        <p className="text-sm text-gray-500">Shymkent</p>
                      </div>
                    </div>
                    <div className="my-1">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {issue.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {issue.location?.address}
                    </div>
                  </div>

                  <div className="flex space-x-2 self-end md:self-center">
                    <Button variant="ghost" className="text-green-600" disabled>
                      <FaCheck className="mr-2" />
                      Done
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No completed issues</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <div className="space-y-4">
            {paginatedIssues.length > 0 ? (
              paginatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {issue.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{issue.userName}</h3>
                        <p className="text-sm text-gray-500">Shymkent</p>
                      </div>
                    </div>
                    <div className="my-1">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {issue.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {issue.location?.address}
                    </div>
                  </div>

                  <div className="flex space-x-2 self-end md:self-center">
                    <Button
                      onClick={() => handleAccept(issue)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Reconsider
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No rejected issues</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {filteredIssues.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            let pageNumber = currentPage;

            if (totalPages <= 3) {
              pageNumber = i + 1;
            } else if (currentPage === 1) {
              pageNumber = i + 1;
            } else if (currentPage === totalPages) {
              pageNumber = totalPages - 2 + i;
            } else {
              pageNumber = currentPage - 1 + i;
            }

            return (
              <Button
                key={i}
                variant={pageNumber === currentPage ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(pageNumber)}
                className={pageNumber === currentPage ? "bg-ainala-blue" : ""}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Accept Issue Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Issue</DialogTitle>
            <DialogDescription>
              Assign a responsible department and set a deadline for this issue.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                defaultValue="City Department"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                defaultValue={
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="importance" className="text-right">
                Importance
              </Label>
              <select
                id="importance"
                className="col-span-3 border border-gray-300 rounded-md p-2"
                defaultValue="medium"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAccept}
              className="bg-ainala-blue hover:bg-blue-700"
            >
              Accept Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Issue Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Issue</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this issue.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="col-span-3 border border-gray-300 rounded-md p-2 h-24"
                placeholder="Explain why this issue is being rejected..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
