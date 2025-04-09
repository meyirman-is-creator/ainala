"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setIssues,
  setStatusFilter,
  setCategoryFilter,
} from "@/store/slices/issues-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IssueCard from "@/components/issues/issue-card";
import IssueFilter from "@/components/issues/issue-filter";
import { Issue, IssueStatus, IssueCategory } from "@/types/issue";
import { fetchIssues } from "@/lib/api-helpers";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface IssueListProps {
  initialIssues?: Issue[];
  userId?: string;
  showFilter?: boolean;
  showPagination?: boolean;
  showEmptyState?: boolean;
  compact?: boolean;
  defaultStatus?: IssueStatus | null;
  defaultCategory?: IssueCategory | null;
  onIssueClick?: (issue: Issue) => void;
  className?: string;
  title?: string;
  maxItems?: number;
}

export default function IssueList({
  initialIssues,
  userId,
  showFilter = true,
  showPagination = true,
  showEmptyState = true,
  compact = false,
  defaultStatus = null,
  defaultCategory = null,
  onIssueClick,
  className = "",
  title,
  maxItems,
}: IssueListProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const issues = useAppSelector((state) => state.issues.issues);
  const filters = useAppSelector((state) => state.issues.filters);

  const [isLoading, setIsLoading] = useState(!initialIssues);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(maxItems || 9);

  useEffect(() => {
    if (initialIssues) {
      dispatch(setIssues(initialIssues));
      setIsLoading(false);
      setTotalPages(Math.ceil(initialIssues.length / itemsPerPage));
    } else {
      // Set initial filters if provided
      if (defaultStatus) {
        dispatch(setStatusFilter(defaultStatus));
      }

      if (defaultCategory) {
        dispatch(setCategoryFilter(defaultCategory));
      }

      loadIssues();
    }
  }, [dispatch, initialIssues, defaultStatus, defaultCategory, itemsPerPage]);

  useEffect(() => {
    // Reload issues when filters change
    if (!initialIssues) {
      loadIssues();
    }
  }, [filters.status, filters.category, filters.searchQuery, currentPage]);

  const loadIssues = async () => {
    setIsLoading(true);

    try {
      const response = await fetchIssues({
        userId,
        status: filters.status,
        category: filters.category,
        search: filters.searchQuery,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        dispatch(setIssues(response.data.issues));
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error(response.message || "Failed to fetch issues");
      }
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter issues if initialIssues were provided
  const filteredIssues = initialIssues
    ? issues.filter((issue) => {
        const matchesStatus =
          !filters.status || issue.status === filters.status;
        const matchesCategory =
          !filters.category || issue.category === filters.category;
        const matchesQuery =
          !filters.searchQuery ||
          issue.title
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          issue.description
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase());

        return matchesStatus && matchesCategory && matchesQuery;
      })
    : issues;

  // Apply pagination
  const paginatedIssues = initialIssues
    ? filteredIssues.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : filteredIssues;

  const handleIssueClick = (issue: Issue) => {
    if (onIssueClick) {
      onIssueClick(issue);
    } else {
      router.push(`/issue/${issue.id}`);
    }
  };

  return (
    <div className={className}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

      {showFilter && (
        <div className="mb-6">
          <IssueFilter />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 animate-pulse rounded-lg h-64"
            />
          ))}
        </div>
      ) : (
        <>
          {paginatedIssues.length > 0 ? (
            <div
              className={cn(
                "grid gap-6",
                compact
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {paginatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => handleIssueClick(issue)}
                  className="cursor-pointer"
                >
                  <IssueCard issue={issue} compact={compact} />
                </div>
              ))}
            </div>
          ) : (
            showEmptyState && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
            )
          )}

          {showPagination && totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber = currentPage;

                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={
                      pageNumber === currentPage ? "bg-ainala-blue" : ""
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <FaChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
