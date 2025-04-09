'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaRegCalendarAlt, FaRegComment, FaRegHeart, FaChevronRight } from 'react-icons/fa';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Issue, IssueStatus, IssueCategory } from '@/types/issue';

// Mock data for issues
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing damage to vehicles',
    category: 'roads',
    status: 'to-do',
    createdAt: '2023-04-05T14:48:00.000Z',
    updatedAt: '2023-04-05T14:48:00.000Z',
    userId: 'user1',
    userName: 'Antonio Banderas',
    photos: ['/images/pothole.jpg'],
    likes: 5,
    comments: [],
  },
  {
    id: '2',
    title: 'Traffic light malfunction',
    description: 'Traffic light stuck on red at the intersection of 5th and Main',
    category: 'safety',
    status: 'progress',
    createdAt: '2023-04-03T10:30:00.000Z',
    updatedAt: '2023-04-04T12:15:00.000Z',
    userId: 'user1',
    userName: 'Antonio Banderas',
    photos: ['/images/traffic-light.jpg'],
    likes: 8,
    responsible: {
      id: 'admin1',
      name: 'City Traffic Department',
    },
    comments: [],
  },
  {
    id: '3',
    title: 'Broken street lamp',
    description: 'Street lamp not working at night, creating safety issues',
    category: 'energy-supply',
    status: 'done',
    createdAt: '2023-03-28T09:12:00.000Z',
    updatedAt: '2023-04-01T16:45:00.000Z',
    userId: 'user1',
    userName: 'Antonio Banderas',
    photos: ['/images/street-lamp.jpg'],
    resultPhoto: '/images/fixed-lamp.jpg',
    likes: 3,
    comments: [],
  },
  {
    id: '4',
    title: 'Water main leak',
    description: 'Water leaking from main pipe onto the sidewalk',
    category: 'water-supply',
    status: 'progress',
    createdAt: '2023-04-01T15:20:00.000Z',
    updatedAt: '2023-04-02T10:10:00.000Z',
    userId: 'user1',
    userName: 'Antonio Banderas',
    photos: ['/images/water-leak.jpg'],
    likes: 12,
    responsible: {
      id: 'admin2',
      name: 'City Water Department',
    },
    comments: [],
  },
  {
    id: '5',
    title: 'Graffiti on public building',
    description: 'Offensive graffiti on the wall of the community center',
    category: 'safety',
    status: 'to-do',
    createdAt: '2023-04-06T08:45:00.000Z',
    updatedAt: '2023-04-06T08:45:00.000Z',
    userId: 'user1',
    userName: 'Antonio Banderas',
    photos: ['/images/graffiti.jpg'],
    likes: 2,
    comments: [],
  },
];

const categories: { value: IssueCategory; label: string }[] = [
  { value: 'roads', label: 'Roads' },
  { value: 'energy-supply', label: 'Energy Supply' },
  { value: 'water-supply', label: 'Water Supply' },
  { value: 'network', label: 'Network' },
  { value: 'public-transport', label: 'Public Transport' },
  { value: 'ecology', label: 'Ecology' },
  { value: 'safety', label: 'Safety' },
  { value: 'csc', label: 'Citizens Service Center (CSC)' },
];

export default function PublicIssueDetailsPage() {
  const { data: session } = useSession();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState<IssueStatus>('to-do');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | ''>('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    setIssues(mockIssues);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search API call
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
  };

  const filteredIssues = issues.filter((issue) => {
    // Filter by status (tab)
    const matchesStatus = issue.status === activeTab;
    
    // Filter by category
    const matchesCategory = !selectedCategory || issue.category === selectedCategory;
    
    // Filter by search query
    const matchesQuery = !searchQuery || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesQuery;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">City Issues</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search issues, add photos and tags"
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FaSearch className="text-gray-400" />
            </div>
          </form>
        </div>
        <div className="flex gap-2">
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <FaFilter className="mr-2" />
                Filters
                {selectedCategory && (
                  <Badge className="ml-2 bg-ainala-blue">1</Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Issues</DialogTitle>
                <DialogDescription>
                  Narrow down the issue list by applying filters.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(value) => setSelectedCategory(value as IssueCategory | '')}
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

      {selectedCategory && (
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-600 mr-2">Active filters:</span>
          <Badge className="bg-ainala-blue mr-2 flex items-center">
            {categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
            <button 
              className="ml-1 hover:text-gray-200"
              onClick={() => setSelectedCategory('')}
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
      
      <Tabs defaultValue="to-do" onValueChange={(value) => setActiveTab(value as IssueStatus)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="to-do" className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white">
            To Do
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="done" className="data-[state=active]:bg-ainala-blue data-[state=active]:text-white">
            Done
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {['to-do', 'progress', 'done'].map((status) => (
            <TabsContent key={status} value={status} className="mt-0">
              {filteredIssues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIssues.map((issue) => (
                    <Card key={issue.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      {issue.photos && issue.photos.length > 0 && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={issue.photos[0]}
                            alt={issue.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                        
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <div className="flex items-center mr-3">
                            <FaRegCalendarAlt className="mr-1" />
                            {formatDate(issue.createdAt)}
                          </div>
                          {issue.location?.address && (
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              <span className="truncate max-w-[120px]">{issue.location.address}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center text-gray-500 text-sm">
                              <FaRegHeart className="mr-1" />
                              {issue.likes}
                            </span>
                            <span className="flex items-center text-gray-500 text-sm">
                              <FaRegComment className="mr-1" />
                              {issue.comments?.length || 0}
                            </span>
                          </div>
                          
                          <Link href={`/issue/${issue.id}`}>
                            <Button variant="ghost" size="sm" className="text-ainala-blue">
                              View Details
                              <FaChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or check back later.</p>
                  {!session && (
                    <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                      <Link href="/sign-up">
                        Sign Up to Report Issues
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}