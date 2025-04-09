"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { FaReply, FaTrash, FaFlag } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/issue";
import { useAppDispatch } from "@/store";
import { addComment } from "@/store/slices/issues-slice";
import { showToast } from "@/store/slices/ui-slice";
import { addCommentToIssue, deleteComment } from "@/lib/api-helpers";

interface CommentsSectionProps {
  issueId: string;
  comments: Comment[];
  className?: string;
}

export default function CommentsSection({
  issueId,
  comments = [],
  className = "",
}: CommentsSectionProps) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const handleCommentSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      // Format the comment content to include reply information if needed
      let commentContent = newComment;
      if (replyToId) {
        const replyToComment = comments.find((c) => c.id === replyToId);
        if (replyToComment) {
          commentContent = `@${replyToComment.userName}: ${commentContent}`;
        }
      }

      // API call to add comment
      const response = await addCommentToIssue(issueId, commentContent);

      if (response.success && response.data) {
        dispatch(
          addComment({
            issueId,
            comment: response.data,
          })
        );

        setNewComment("");
        setReplyToId(null);

        dispatch(
          showToast({
            message: "Comment added successfully",
            type: "success",
          })
        );
      } else {
        throw new Error(response.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      dispatch(
        showToast({
          message:
            error instanceof Error ? error.message : "Failed to add comment",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyToId(commentId);

    // Find the comment we're replying to
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setNewComment(`@${comment.userName} `);

      // Focus on textarea
      const textarea = document.getElementById("comment-textarea");
      if (textarea) {
        textarea.focus();
        // Scroll to the textarea
        textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session) return;

    try {
      // API call to delete comment
      const response = await deleteComment(issueId, commentId);

      if (response.success) {
        // In a real app, you would update Redux state to remove the comment
        // For this demo, we'll just show a success message and rely on a refresh
        dispatch(
          showToast({
            message: "Comment deleted successfully",
            type: "success",
          })
        );

        // Refresh the page or fetch comments again
        window.location.reload();
      } else {
        throw new Error(response.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      dispatch(
        showToast({
          message:
            error instanceof Error ? error.message : "Failed to delete comment",
          type: "error",
        })
      );
    }
  };

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>

      <form onSubmit={handleCommentSubmit} className="space-y-4">
        <Textarea
          id="comment-textarea"
          placeholder={session ? "Add a comment..." : "Sign in to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!session || isSubmitting}
          className="min-h-[100px]"
        />

        {replyToId && (
          <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
            <span className="text-sm text-blue-700">Replying to a comment</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyToId(null);
                setNewComment("");
              }}
            >
              Cancel Reply
            </Button>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-ainala-blue hover:bg-blue-700"
            disabled={!session || isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {!session && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
          <p className="text-gray-700">
            Please{" "}
            <a href="/sign-in" className="text-blue-600 hover:underline">
              sign in
            </a>{" "}
            to join the conversation.
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="py-4 first:pt-0"
              id={`comment-${comment.id}`}
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
                    <h4 className="font-medium">{comment.userName}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {comment.content}
                  </p>

                  <div className="mt-2 flex items-center space-x-4">
                    {session && (
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="text-xs text-gray-500 hover:text-blue-600 flex items-center"
                      >
                        <FaReply className="mr-1" size={12} /> Reply
                      </button>
                    )}

                    {(isAdmin || session?.user?.id === comment.userId) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-gray-500 hover:text-red-600 flex items-center"
                      >
                        <FaTrash className="mr-1" size={12} /> Delete
                      </button>
                    )}

                    <button className="text-xs text-gray-500 hover:text-amber-600 flex items-center">
                      <FaFlag className="mr-1" size={12} /> Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
