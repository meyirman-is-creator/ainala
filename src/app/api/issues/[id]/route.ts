import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ApiResponse } from "@/types/api";
import { Issue, IssueStatus } from "@/types/issue";

// This is a mock database for demo purposes
// In a real application, you would use a real database
let mockIssues: Issue[] = [
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
  // More mock issues would be here
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Find the issue by ID
    const issue = mockIssues.find((issue) => issue.id === id);

    if (!issue) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Issue not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Issue>>({
      success: true,
      message: "Issue retrieved successfully",
      data: issue,
    });
  } catch (error) {
    console.error("Error retrieving issue:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "An error occurred while retrieving the issue",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const id = params.id;

    // Check if the user is authenticated
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    // Find the issue by ID
    const issueIndex = mockIssues.findIndex((issue) => issue.id === id);

    if (issueIndex === -1) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Issue not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const issue = mockIssues[issueIndex];

    // Check permissions - only the issue owner or admin can update the issue
    // except for likes and comments which anyone can update
    const isAdmin = session.user.role === "admin";
    const isOwner = issue.userId === session.user.id;

    const requestData = await request.json();

    // Special case: handle likes
    if (requestData.action === "like") {
      if (issue.liked) {
        issue.likes = Math.max(0, issue.likes - 1);
        issue.liked = false;
      } else {
        issue.likes += 1;
        issue.liked = true;
      }

      issue.updatedAt = new Date().toISOString();
      mockIssues[issueIndex] = issue;

      return NextResponse.json<ApiResponse<Issue>>({
        success: true,
        message: issue.liked
          ? "Issue liked successfully"
          : "Issue unliked successfully",
        data: issue,
      });
    }

    // Special case: handle comments
    if (requestData.action === "comment" && requestData.comment) {
      const newComment = {
        id: `comment-${Date.now()}`,
        userId: session.user.id,
        userName: session.user.name || "Anonymous",
        userAvatar: session.user.image,
        content: requestData.comment,
        createdAt: new Date().toISOString(),
      };

      issue.comments = [...(issue.comments || []), newComment];
      issue.updatedAt = new Date().toISOString();
      mockIssues[issueIndex] = issue;

      return NextResponse.json<ApiResponse<Issue>>({
        success: true,
        message: "Comment added successfully",
        data: issue,
      });
    }

    // For other updates, check if the user has permission
    if (!isAdmin && !isOwner) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "You do not have permission to update this issue",
          data: null,
        },
        { status: 403 }
      );
    }

    // Update the issue with the provided data
    // Only admin can update certain fields
    const updatedIssue = { ...issue };

    if (isAdmin) {
      // Admin can update all fields
      if (requestData.status) updatedIssue.status = requestData.status;
      if (requestData.responsible)
        updatedIssue.responsible = requestData.responsible;
      if (requestData.deadline) updatedIssue.deadline = requestData.deadline;
      if (requestData.importance)
        updatedIssue.importance = requestData.importance;
      if (requestData.adminComment)
        updatedIssue.adminComment = requestData.adminComment;

      // If status is being updated to 'done', require a result photo
      if (
        requestData.status === "done" &&
        !requestData.resultPhoto &&
        !updatedIssue.resultPhoto
      ) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "A result photo is required when marking an issue as done",
            data: null,
          },
          { status: 400 }
        );
      }

      if (requestData.resultPhoto)
        updatedIssue.resultPhoto = requestData.resultPhoto;
    }

    // Fields that both owner and admin can update
    if (requestData.title) updatedIssue.title = requestData.title;
    if (requestData.description)
      updatedIssue.description = requestData.description;
    if (requestData.category) updatedIssue.category = requestData.category;
    if (requestData.photos) updatedIssue.photos = requestData.photos;
    if (requestData.location) updatedIssue.location = requestData.location;

    // Update the timestamp
    updatedIssue.updatedAt = new Date().toISOString();

    // Save the updated issue
    mockIssues[issueIndex] = updatedIssue;

    return NextResponse.json<ApiResponse<Issue>>({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "An error occurred while updating the issue",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const id = params.id;

    // Check if the user is authenticated
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    // Find the issue by ID
    const issueIndex = mockIssues.findIndex((issue) => issue.id === id);

    if (issueIndex === -1) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Issue not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const issue = mockIssues[issueIndex];

    // Check permissions - only the issue owner or admin can delete the issue
    const isAdmin = session.user.role === "admin";
    const isOwner = issue.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "You do not have permission to delete this issue",
          data: null,
        },
        { status: 403 }
      );
    }

    // Remove the issue from the mock database
    mockIssues = mockIssues.filter((issue) => issue.id !== id);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Issue deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "An error occurred while deleting the issue",
        data: null,
      },
      { status: 500 }
    );
  }
}
