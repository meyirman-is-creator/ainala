"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  FaCheck,
  FaClock,
  FaPause,
  FaTimes,
  FaSpinner,
  FaEdit,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IssueStatus } from "@/types/issue";
import { useAppDispatch } from "@/store";
import { updateIssue } from "@/store/slices/issues-slice";
import { showToast } from "@/store/slices/ui-slice";
import { updateIssueStatus } from "@/lib/api-helpers";

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

const statusConfig: Record<IssueStatus, StatusConfig> = {
  "to-do": {
    label: "To Do",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    icon: <FaClock className="mr-2" />,
  },
  progress: {
    label: "In Progress",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    icon: <FaSpinner className="mr-2 animate-spin" />,
  },
  done: {
    label: "Done",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    icon: <FaCheck className="mr-2" />,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    icon: <FaTimes className="mr-2" />,
  },
};

interface IssueStatusProps {
  issueId: string;
  status: IssueStatus;
  isEditable?: boolean;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onStatusChange?: (newStatus: IssueStatus) => void;
}

export default function IssueStatus({
  issueId,
  status,
  isEditable = false,
  showLabel = true,
  showIcon = true,
  size = "md",
  className = "",
  onStatusChange,
}: IssueStatusProps) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [isChanging, setIsChanging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>(status);
  const [rejectReason, setRejectReason] = useState("");
  const [resultPhotoUrl, setResultPhotoUrl] = useState("");

  const config = statusConfig[status];
  const isAdmin = session?.user?.role === "admin";
  const canEdit = isEditable && (isAdmin || status === "to-do");

  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-3",
    lg: "text-base py-1.5 px-4",
  };

  const handleStatusChange = async (newStatusValue: string) => {
    const selectedStatus = newStatusValue as IssueStatus;
    setNewStatus(selectedStatus);

    // If changing to 'done', open dialog to request result photo
    if (selectedStatus === "done") {
      setIsDialogOpen(true);
      return;
    }

    // If changing to 'rejected', open dialog to request reason
    if (selectedStatus === "rejected") {
      setIsDialogOpen(true);
      return;
    }

    // Otherwise, proceed with the status change
    await updateStatus(selectedStatus);
  };

  const updateStatus = async (
    updatedStatus: IssueStatus,
    additionalData: any = {}
  ) => {
    setIsChanging(true);

    try {
      // API call to update status
      const response = await updateIssueStatus(
        issueId,
        updatedStatus,
        additionalData
      );

      if (response.success && response.data) {
        dispatch(updateIssue(response.data));

        if (onStatusChange) {
          onStatusChange(updatedStatus);
        }

        dispatch(
          showToast({
            message: `Issue status updated to ${statusConfig[updatedStatus].label}`,
            type: "success",
          })
        );
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      dispatch(
        showToast({
          message:
            error instanceof Error ? error.message : "Failed to update status",
          type: "error",
        })
      );
    } finally {
      setIsChanging(false);
      setIsDialogOpen(false);
    }
  };

  const confirmStatusChange = () => {
    const additionalData: any = {};

    if (newStatus === "rejected" && rejectReason) {
      additionalData.adminComment = rejectReason;
    }

    if (newStatus === "done" && resultPhotoUrl) {
      additionalData.resultPhoto = resultPhotoUrl;
    }

    updateStatus(newStatus, additionalData);
  };

  // For read-only display
  if (!canEdit) {
    return (
      <Badge
        className={cn(
          config.bgColor,
          config.color,
          "border",
          config.borderColor,
          sizeClasses[size],
          "font-medium",
          className
        )}
      >
        {showIcon && config.icon}
        {showLabel && config.label}
      </Badge>
    );
  }

  // For editable status
  return (
    <>
      <div className={className}>
        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={isChanging}
        >
          <SelectTrigger
            className={cn(
              "h-auto",
              sizeClasses[size],
              config.bgColor,
              config.color,
              "border",
              config.borderColor,
              "font-medium",
              "flex items-center gap-1",
              isChanging && "opacity-70"
            )}
          >
            {showIcon && config.icon}
            <SelectValue>{showLabel ? config.label : ""}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to-do" className="flex items-center">
              <FaClock className="mr-2 text-amber-500" /> To Do
            </SelectItem>
            <SelectItem value="progress" className="flex items-center">
              <FaSpinner className="mr-2 text-blue-500" /> In Progress
            </SelectItem>
            <SelectItem value="done" className="flex items-center">
              <FaCheck className="mr-2 text-green-500" /> Done
            </SelectItem>
            <SelectItem value="rejected" className="flex items-center">
              <FaTimes className="mr-2 text-red-500" /> Rejected
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dialog for Done status - Request result photo */}
      <Dialog
        open={isDialogOpen && newStatus === "done"}
        onOpenChange={(open) => {
          if (!open) setIsDialogOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark issue as resolved</DialogTitle>
            <DialogDescription>
              Please provide a photo showing the resolved issue.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Result Photo</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // In a real app, this would upload the file to a server
                    // For this demo, we'll just create a local URL
                    setResultPhotoUrl(URL.createObjectURL(file));
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                This photo will be displayed as proof that the issue has been
                resolved.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              className="bg-green-600 hover:bg-green-700"
              disabled={!resultPhotoUrl || isChanging}
            >
              {isChanging ? "Updating..." : "Mark as Resolved"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Rejected status - Request reason */}
      <Dialog
        open={isDialogOpen && newStatus === "rejected"}
        onOpenChange={(open) => {
          if (!open) setIsDialogOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Issue</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this issue.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Reason</label>
              <textarea
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Explain why this issue is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              variant="destructive"
              disabled={!rejectReason.trim() || isChanging}
            >
              {isChanging ? "Rejecting..." : "Reject Issue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
