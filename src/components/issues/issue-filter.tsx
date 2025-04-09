"use client";

import { useState } from "react";
import {
  FaFilter,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSortAmountDown,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setCategoryFilter,
  setStatusFilter,
  clearFilters,
  setSearchQuery,
} from "@/store/slices/issues-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IssueCategory, IssueStatus } from "@/types/issue";

// Categories and statuses for the filter
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

const statuses: { value: IssueStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "to-do", label: "To Do" },
  { value: "progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "rejected", label: "Rejected" },
];

interface IssueFilterProps {
  showStatus?: boolean;
  showLocation?: boolean;
  showSort?: boolean;
  className?: string;
}

export default function IssueFilter({
  showStatus = true,
  showLocation = false,
  showSort = false,
  className = "",
}: IssueFilterProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.issues.filters);

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.searchQuery);
  const [localCategory, setLocalCategory] = useState<IssueCategory | null>(
    filters.category
  );
  const [localStatus, setLocalStatus] = useState<IssueStatus | null>(
    filters.status
  );
  const [localImportance, setLocalImportance] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  // For location filter if needed
  const [locationRadius, setLocationRadius] = useState("10");
  const [locationSearch, setLocationSearch] = useState("");

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.searchQuery) count++;
    if (localImportance.length > 0) count++;
    return count;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchValue));
  };

  const handleApplyFilters = () => {
    dispatch(setCategoryFilter(localCategory));
    dispatch(setStatusFilter(localStatus));
    // Additional filters would be dispatched here

    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setLocalCategory(null);
    setLocalStatus(null);
    setLocalImportance([]);
    setSortBy("newest");
    setLocationRadius("10");
    setLocationSearch("");

    dispatch(clearFilters());
  };

  const handleRemoveCategory = () => {
    setLocalCategory(null);
    dispatch(setCategoryFilter(null));
  };

  const handleRemoveStatus = () => {
    setLocalStatus(null);
    dispatch(setStatusFilter(null));
  };

  const toggleImportance = (value: string) => {
    setLocalImportance((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search issues by title or description"
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="p-0 h-auto text-gray-400 hover:text-gray-600"
              >
                <FaFilter className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </form>
        </div>

        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center whitespace-nowrap"
            >
              <FaFilter className="mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-2 bg-ainala-blue">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filter Issues</DialogTitle>
              <DialogDescription>
                Narrow down the issue list by applying filters.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="text-sm font-medium">
                    Category
                  </AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={localCategory || ""}
                      onValueChange={(value) =>
                        setLocalCategory(
                          value ? (value as IssueCategory) : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                {showStatus && (
                  <AccordionItem value="status">
                    <AccordionTrigger className="text-sm font-medium">
                      Status
                    </AccordionTrigger>
                    <AccordionContent>
                      <Select
                        value={localStatus || ""}
                        onValueChange={(value) =>
                          setLocalStatus(value ? (value as IssueStatus) : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="importance">
                  <AccordionTrigger className="text-sm font-medium">
                    Importance
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="importance-high"
                          checked={localImportance.includes("high")}
                          onCheckedChange={() => toggleImportance("high")}
                        />
                        <Label
                          htmlFor="importance-high"
                          className="text-sm font-normal"
                        >
                          <span className="text-red-600">High Priority</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="importance-medium"
                          checked={localImportance.includes("medium")}
                          onCheckedChange={() => toggleImportance("medium")}
                        />
                        <Label
                          htmlFor="importance-medium"
                          className="text-sm font-normal"
                        >
                          <span className="text-amber-600">
                            Medium Priority
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="importance-low"
                          checked={localImportance.includes("low")}
                          onCheckedChange={() => toggleImportance("low")}
                        />
                        <Label
                          htmlFor="importance-low"
                          className="text-sm font-normal"
                        >
                          <span className="text-green-600">Low Priority</span>
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {showSort && (
                  <AccordionItem value="sort">
                    <AccordionTrigger className="text-sm font-medium">
                      Sort By
                    </AccordionTrigger>
                    <AccordionContent>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="likes">Most Liked</SelectItem>
                          <SelectItem value="comments">
                            Most Comments
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {showLocation && (
                  <AccordionItem value="location">
                    <AccordionTrigger className="text-sm font-medium">
                      Location
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="locationSearch">Search Area</Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                              <FaMapMarkerAlt className="text-gray-500" />
                            </div>
                            <Input
                              id="locationSearch"
                              placeholder="Enter location"
                              value={locationSearch}
                              onChange={(e) =>
                                setLocationSearch(e.target.value)
                              }
                              className="rounded-l-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="locationRadius">Radius (km)</Label>
                          <Select
                            value={locationRadius}
                            onValueChange={setLocationRadius}
                          >
                            <SelectTrigger id="locationRadius">
                              <SelectValue placeholder="Select radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 km</SelectItem>
                              <SelectItem value="10">10 km</SelectItem>
                              <SelectItem value="25">25 km</SelectItem>
                              <SelectItem value="50">50 km</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            // Get user's current location
                            if ("geolocation" in navigator) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  // In a real app, we would reverse geocode to get address
                                  setLocationSearch(
                                    `Lat: ${position.coords.latitude.toFixed(
                                      4
                                    )}, Lng: ${position.coords.longitude.toFixed(
                                      4
                                    )}`
                                  );
                                },
                                (error) => {
                                  console.error(
                                    "Error getting location:",
                                    error
                                  );
                                }
                              );
                            }
                          }}
                        >
                          <FaMapMarkerAlt className="mr-2" />
                          Use Current Location
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {showSort && (
                  <AccordionItem value="date">
                    <AccordionTrigger className="text-sm font-medium">
                      Date Range
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">From</Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                              <FaCalendarAlt className="text-gray-500" />
                            </div>
                            <Input
                              id="startDate"
                              type="date"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate">To</Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                              <FaCalendarAlt className="text-gray-500" />
                            </div>
                            <Input
                              id="endDate"
                              type="date"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
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
                onClick={handleApplyFilters}
                className="bg-ainala-blue hover:bg-blue-700"
              >
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showSort && (
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <FaSortAmountDown className="mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
              <SelectItem value="comments">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>

          {filters.category && (
            <Badge className="bg-ainala-blue flex items-center">
              {categories.find((c) => c.value === filters.category)?.label ||
                filters.category}
              <button
                className="ml-1 hover:text-gray-200"
                onClick={handleRemoveCategory}
              >
                <FaTimes size={10} />
              </button>
            </Badge>
          )}

          {filters.status && (
            <Badge className="bg-ainala-blue flex items-center">
              {statuses.find((s) => s.value === filters.status)?.label ||
                filters.status}
              <button
                className="ml-1 hover:text-gray-200"
                onClick={handleRemoveStatus}
              >
                <FaTimes size={10} />
              </button>
            </Badge>
          )}

          {filters.searchQuery && (
            <Badge className="bg-ainala-blue flex items-center">
              Search: "{filters.searchQuery}"
              <button
                className="ml-1 hover:text-gray-200"
                onClick={() => {
                  setSearchValue("");
                  dispatch(setSearchQuery(""));
                }}
              >
                <FaTimes size={10} />
              </button>
            </Badge>
          )}

          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={handleClearFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
