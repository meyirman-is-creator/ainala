import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Issue, IssueStatus, IssueCategory } from "@/types/issue";
import { ApiResponse } from "@/types/api";

// Mock database for demo purposes
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
  // Add more mock issues as needed
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status") as IssueStatus | null;
    const category = searchParams.get("category") as IssueCategory | null;
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Filter issues based on query parameters
    let filteredIssues = [...mockIssues];

    if (status) {
      filteredIssues = filteredIssues.filter(
        (issue) => issue.status === status
      );
    }

    if (category) {
      filteredIssues = filteredIssues.filter(
        (issue) => issue.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredIssues = filteredIssues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchLower) ||
          issue.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by user ID if specified (and user is authenticated or admin)
    if (userId) {
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

      // Allow admins to see any user's issues, but regular users can only see their own
      if (session.user.role !== "admin" && userId !== session.user.id) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "Forbidden",
            data: null,
          },
          { status: 403 }
        );
      }

      filteredIssues = filteredIssues.filter(
        (issue) => issue.userId === userId
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

    // Calculate total pages
    const totalIssues = filteredIssues.length;
    const totalPages = Math.ceil(totalIssues / limit);

    return NextResponse.json<
      ApiResponse<{
        issues: Issue[];
        pagination: {
          totalIssues: number;
          totalPages: number;
          currentPage: number;
          limit: number;
        };
      }>
    >({
      success: true,
      message: "Issues retrieved successfully",
      data: {
        issues: paginatedIssues,
        pagination: {
          totalIssues,
          totalPages,
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving issues:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "An error occurred while retrieving issues",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    const requestData = await request.json();

    // Validate required fields
    if (
      !requestData.title ||
      !requestData.description ||
      !requestData.category
    ) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Title, description, and category are required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Create a new issue
    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      title: requestData.title,
      description: requestData.description,
      category: requestData.category,
      status: "to-do",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      userAvatar: session.user.image,
      photos: requestData.photos || [],
      likes: 0,
      comments: [],
      location: requestData.location,
    };

    // Add to the mock database
    mockIssues.unshift(newIssue);

    return NextResponse.json<ApiResponse<Issue>>(
      {
        success: true,
        message: "Issue created successfully",
        data: newIssue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "An error occurred while creating the issue",
        data: null,
      },
      { status: 500 }
    );
  }
}
