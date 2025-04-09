"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Issue, IssueStatus } from "@/types/issue";
import { useAppDispatch } from "@/store";
import { toggleLike } from "@/store/slices/issues-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IssueCardProps {
  issue: Issue;
  compact?: boolean;
}

export default function IssueCard({ issue, compact = false }: IssueCardProps) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);

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

  const handleLikeClick = () => {
    if (session) {
      dispatch(toggleLike(issue.id));
    }
  };

  const isLiked = issue.liked || false;
  const formattedDate = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "bg-white rounded-lg overflow-hidden transition-all shadow-md hover:shadow-lg border border-gray-100",
        compact ? "flex flex-row items-center" : ""
      )}
    >
      {!compact && issue.photos && issue.photos.length > 0 && (
        <div className="relative h-48 w-full overflow-hidden">
          {!imageError ? (
            <Image
              src={issue.photos[0]}
              alt={issue.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Image unavailable</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={`${statusColors[issue.status]} text-white`}>
              {statusLabels[issue.status]}
            </Badge>
          </div>
        </div>
      )}

      <div className={cn("p-4", compact && "flex-1")}>
        {compact && (
          <div className="float-right">
            <Badge className={`${statusColors[issue.status]} text-white`}>
              {statusLabels[issue.status]}
            </Badge>
          </div>
        )}

        <Link href={`/issue/${issue.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {issue.title}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="flex items-center mr-3">
            <FaCalendarAlt className="mr-1 text-gray-400" size={12} />
            {formattedDate}
          </span>
          {issue.location?.address && (
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-gray-400" size={12} />
              {issue.location.address}
            </span>
          )}
        </div>

        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            {categoryLabels[issue.category] || issue.category}
          </Badge>
          {issue.importance && (
            <Badge
              variant="outline"
              className={cn(
                "ml-2 text-xs",
                issue.importance === "high"
                  ? "text-red-500 border-red-500"
                  : issue.importance === "medium"
                  ? "text-amber-500 border-amber-500"
                  : "text-green-500 border-green-500"
              )}
            >
              {issue.importance.charAt(0).toUpperCase() +
                issue.importance.slice(1)}{" "}
              Priority
            </Badge>
          )}
        </div>

        {!compact && (
          <p className="text-gray-600 mb-4 line-clamp-2">{issue.description}</p>
        )}

        {issue.responsible && (
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-500 mr-2">Responsible:</span>
            <div className="flex items-center">
              {issue.responsible.avatar ? (
                <Image
                  src={issue.responsible.avatar}
                  alt={issue.responsible.name}
                  width={20}
                  height={20}
                  className="rounded-full mr-1"
                />
              ) : (
                <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-1">
                  {issue.responsible.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium">
                {issue.responsible.name}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <button
              onClick={handleLikeClick}
              disabled={!session}
              className={cn(
                "flex items-center mr-4 text-sm",
                isLiked ? "text-red-500" : "text-gray-500",
                !session && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLiked ? (
                <FaHeart className="mr-1" />
              ) : (
                <FaRegHeart className="mr-1" />
              )}
              {issue.likes}
            </button>
            <Link
              href={`/issue/${issue.id}#comments`}
              className="flex items-center text-sm text-gray-500"
            >
              <FaComment className="mr-1" />
              {issue.comments?.length || 0}
            </Link>
          </div>

          <Link href={`/issue/${issue.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
