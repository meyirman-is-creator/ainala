"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaMapMarkerAlt,
  FaClock,
  FaTags,
  FaUser,
  FaCalendarAlt,
  FaPaperclip,
  FaCheck,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setCurrentIssue,
  toggleLike,
  addComment,
} from "@/store/slices/issues-slice";
import { showToast } from "@/store/slices/ui-slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IssueStatus } from "@/types/issue";

// Mock issue data (in a real app, this would be fetched from an API)
const mockIssue = {
  id: "issue-123",
  title: "Large pothole on Main Street",
  description:
    "There is a large pothole on Main Street near the intersection with 5th Avenue. It has already caused damage to several vehicles and poses a significant safety hazard, especially during rainy weather when it fills with water and becomes less visible.",
  category: "roads",
  status: "progress" as IssueStatus,
  createdAt: "2023-04-03T10:30:00.000Z",
  updatedAt: "2023-04-04T12:15:00.000Z",
  userId: "user1",
  userName: "Antonio Banderas",
  userAvatar: "/images/avatar.png",
  photos: ["/images/pothole1.jpg", "/images/pothole2.jpg"],
  likes: 24,
  liked: false,
  location: {
    latitude: 51.5074,
    longitude: -0.1278,
    address: "123 Main Street, Downtown",
  },
  importance: "high" as const,
  deadline: "2023-04-20T00:00:00.000Z",
  responsible: {
    id: "dept1",
    name: "City Roads Department",
    avatar: "/images/road-dept.png",
  },
  comments: [
    {
      id: "comment1",
      userId: "user2",
      userName: "Jane Smith",
      userAvatar: "/images/user2.png",
      content: "I hit this pothole yesterday and damaged my tire!",
      createdAt: "2023-04-03T14:25:00.000Z",
    },
    {
      id: "comment2",
      userId: "dept1",
      userName: "City Roads Department",
      userAvatar: "/images/road-dept.png",
      content:
        "Thank you for reporting this issue. We have scheduled a repair for next week.",
      createdAt: "2023-04-04T09:15:00.000Z",
    },
  ],
};

export default function IssueDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const currentIssue = useAppSelector((state) => state.issues.currentIssue);

  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    // In a real app, we would fetch the issue data based on the ID
    // For this demo, we'll use mock data
    dispatch(setCurrentIssue(mockIssue));

    // Cleanup when component unmounts
    return () => {
      dispatch(setCurrentIssue(null));
    };
  }, [dispatch, id]);

  const handleLikeClick = () => {
    if (session && currentIssue) {
      dispatch(toggleLike(currentIssue.id));
    } else if (!session) {
      dispatch(
        showToast({
          message: "Please sign in to like issues",
          type: "info",
        })
      );
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      dispatch(
        showToast({
          message: "Please sign in to comment",
          type: "info",
        })
      );
      return;
    }

    if (!newComment.trim()) {
      dispatch(
        showToast({
          message: "Please enter a comment",
          type: "error",
        })
      );
      return;
    }

    if (currentIssue) {
      const comment = {
        id: `comment-${Date.now()}`,
        userId: session.user?.id || "anonymous",
        userName: session.user?.name || "Anonymous User",
        userAvatar: session.user?.image,
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      dispatch(addComment({ issueId: currentIssue.id, comment }));
      setNewComment("");

      dispatch(
        showToast({
          message: "Comment added successfully",
          type: "success",
        })
      );
    }
  };

  if (!currentIssue) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Loading issue details...</h2>
          <p className="text-gray-500">
            Please wait while we retrieve the information.
          </p>
        </div>
      </div>
    );
  }

  const statusColors: Record<IssueStatus, string> = {
    "to-do": "bg-yellow-500",
    progress: "bg-blue-500",
    done: "bg-green-500",
    rejected: "bg-red-500",
  };

  const statusLabels: Record<IssueStatus, string> = {
    "to-do": "To Do",
    progress: "In Progress",
    done: "Done",
    rejected: "Rejected",
  };

  const categoryLabels: Record<string, string> = {
    roads: "Roads",
    "energy-supply": "Energy Supply",
    "water-supply": "Water Supply",
    network: "Network",
    "public-transport": "Public Transport",
    ecology: "Ecology",
    safety: "Safety",
    csc: "Citizens Service",
  };

  const formattedDate = format(new Date(currentIssue.createdAt), "MMM d, yyyy");
  const formattedDeadline = currentIssue.deadline
    ? format(new Date(currentIssue.deadline), "MMM d, yyyy")
    : null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Badge
          className={`${statusColors[currentIssue.status]} text-white mb-2`}
        >
          {statusLabels[currentIssue.status]}
        </Badge>
        <h1 className="text-2xl font-bold mb-2">{currentIssue.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <FaUser className="mr-1 text-gray-400" />
            {currentIssue.userName}
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1 text-gray-400" />
            {formattedDate}
          </div>
          {currentIssue.location?.address && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-gray-400" />
              {currentIssue.location.address}
            </div>
          )}
          <div className="flex items-center">
            <FaTags className="mr-1 text-gray-400" />
            {categoryLabels[currentIssue.category] || currentIssue.category}
          </div>
          {formattedDeadline && (
            <div className="flex items-center">
              <FaClock className="mr-1 text-gray-400" />
              Due: {formattedDeadline}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({currentIssue.comments?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 whitespace-pre-line mb-6">
                    {currentIssue.description}
                  </p>

                  {currentIssue.responsible && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-blue-900 mb-2">
                        Responsible Department
                      </h3>
                      <div className="flex items-center">
                        {currentIssue.responsible.avatar ? (
                          <Image
                            src={currentIssue.responsible.avatar}
                            alt={currentIssue.responsible.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3">
                            {currentIssue.responsible.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {currentIssue.responsible.name}
                          </p>
                          {currentIssue.importance && (
                            <p className="text-sm">
                              <span
                                className={`
                                font-medium
                                ${
                                  currentIssue.importance === "high"
                                    ? "text-red-600"
                                    : currentIssue.importance === "medium"
                                    ? "text-amber-600"
                                    : "text-green-600"
                                }
                              `}
                              >
                                {currentIssue.importance
                                  .charAt(0)
                                  .toUpperCase() +
                                  currentIssue.importance.slice(1)}{" "}
                                Priority
                              </span>
                              {formattedDeadline &&
                                ` • Due ${formattedDeadline}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentIssue.status === "done" &&
                    currentIssue.resultPhoto && (
                      <div className="mt-6">
                        <h3 className="font-medium text-green-700 flex items-center mb-3">
                          <FaCheck className="mr-2" />
                          Issue Resolved
                        </h3>
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                          <Image
                            src={currentIssue.resultPhoto}
                            alt="Issue resolution"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  {currentIssue.photos && currentIssue.photos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentIssue.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-video w-full rounded-lg overflow-hidden"
                        >
                          <Image
                            src={photo}
                            alt={`Issue photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        No photos available for this issue
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!session}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-ainala-blue hover:bg-blue-700"
                          disabled={!session || !newComment.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </form>
                  </div>

                  {currentIssue.comments && currentIssue.comments.length > 0 ? (
                    <div className="space-y-4">
                      {currentIssue.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border-b border-gray-100 pb-4 last:border-0"
                        >
                          <div className="flex items-start">
                            {comment.userAvatar ? (
                              <Image
                                src={comment.userAvatar}
                                alt={comment.userName}
                                width={40}
                                height={40}
                                className="rounded-full mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center mr-3">
                                {comment.userName.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium">
                                  {comment.userName}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {format(
                                    new Date(comment.createdAt),
                                    "MMM d, yyyy • h:mm a"
                                  )}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        No comments yet. Be the first to comment!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Issue Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <Badge
                    className={`${
                      statusColors[currentIssue.status]
                    } text-white`}
                  >
                    {statusLabels[currentIssue.status]}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="outline">
                    {categoryLabels[currentIssue.category] ||
                      currentIssue.category}
                  </Badge>
                </div>

                {currentIssue.importance && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Priority</span>
                    <Badge
                      variant="outline"
                      className={
                        currentIssue.importance === "high"
                          ? "text-red-500 border-red-500"
                          : currentIssue.importance === "medium"
                          ? "text-amber-500 border-amber-500"
                          : "text-green-500 border-green-500"
                      }
                    >
                      {currentIssue.importance.charAt(0).toUpperCase() +
                        currentIssue.importance.slice(1)}
                    </Badge>
                  </div>
                )}

                {formattedDeadline && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Deadline</span>
                    <span className="text-gray-900">{formattedDeadline}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Engage with this Issue</h3>
              <div className="flex items-center justify-around mb-3">
                <button
                  onClick={handleLikeClick}
                  disabled={!session}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg transition-colors
                    ${
                      currentIssue.liked
                        ? "text-red-500"
                        : "text-gray-500 hover:bg-gray-100"
                    }
                    ${!session && "opacity-50 cursor-not-allowed"}
                  `}
                >
                  {currentIssue.liked ? (
                    <FaHeart className="text-2xl mb-1" />
                  ) : (
                    <FaRegHeart className="text-2xl mb-1" />
                  )}
                  <span className="text-sm">Like</span>
                  <span className="text-xs text-gray-500">
                    {currentIssue.likes}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("comments")}
                  className="flex flex-col items-center justify-center p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <FaComment className="text-2xl mb-1" />
                  <span className="text-sm">Comment</span>
                  <span className="text-xs text-gray-500">
                    {currentIssue.comments?.length || 0}
                  </span>
                </button>

                <button
                  disabled
                  className="flex flex-col items-center justify-center p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <FaPaperclip className="text-2xl mb-1" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {!session && (
                <p className="text-xs text-center text-gray-500">
                  You need to sign in to like or comment on this issue.
                </p>
              )}
            </CardContent>
          </Card>

          {currentIssue.location && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Location</h3>
                <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square mb-2 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-red-500 text-4xl" />
                  {/* In a real app, this would be an actual map */}
                </div>
                <p className="text-gray-600 text-sm">
                  {currentIssue.location.address ||
                    "Location details not available"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
